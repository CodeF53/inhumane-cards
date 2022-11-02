class Game < ApplicationRecord
  has_many :users
  belongs_to :lobby_owner, class_name: 'User', foreign_key: 'lobby_owner_id', optional: true
  belongs_to :card_czar, class_name: 'User', foreign_key: 'card_czar_id', optional: true
  belongs_to :black_card, optional: true

  # make card pools and discard piles into arrays
  serialize :black_card_pool
  serialize :white_card_pool
  serialize :used_white_card_ids
  serialize :used_black_card_ids
  after_initialize do |u|
    u.black_card_pool = [] if u.black_card_pool.nil?
    u.white_card_pool = [] if u.white_card_pool.nil?
    u.used_white_card_ids = [] if u.used_white_card_ids.nil?
    u.used_black_card_ids = [] if u.used_black_card_ids.nil?
  end

  def step_game
    puts "stepping game, phase: #{game_phase}"

    case game_phase
    when 'submit'
      update(game_phase: 'pick') if non_card_czar_users.all?(&:submitted_card?)
      # TODO: randomize card order
    when 'pick'
      # return to submit phase if card czar left
      if card_czar.nil?
        puts 'card czar left'
        puts '\t switching back to submit'
        update(game_phase: 'submit')

        puts '\tselecting new black card and czar'
        select_card_czar
        select_black_card

        puts '\tresetting submitted/picked cards'
        reset_picked_submitted_cards
        return
      end

      # switch to result phase when winning card is picked
      card_czar = User.find(card_czar_id) # ! hacky solution to it not being up to date
      unless card_czar.picked_card_index.nil?
        puts 'card czar has picked winner, switching to result phase and stepping again'
        update(game_phase: 'result')
        step_game
        return
      end
    when 'result'
      # increment score of round winning player
      Util.set_timeout(
        callback: lambda do
          winning_user.increment_game_score
          update_state_cache
        end,
        seconds: 0.2
      )

      # wait 15 seconds for users to admire winning combo
      sleep(5)

      # replace used cards
      non_card_czar_users.each do |user|
        hand = user.hand
        hand[user.submitted_hand_index] = WhiteCard.all.sample.id
        user.update(hand: hand)
      end

      if winning_user.game_score >= winning_score
        puts "#{winning_user.username} wins"
        update(game_phase: 'over')
      else
        puts 'result wait over'
        puts '\tswitching back to submit'
        update(game_phase: 'submit')

        puts '\tselecting new black card and czar'
        select_card_czar
        select_black_card
      end

      reset_picked_submitted_cards
    else # 'lobby' 'over'
      # TODO: add check to make sure this isn't triggered by player leaving the game
      select_card_czar
      select_black_card
      users.each(&:set_game_vars)
      update(game_phase: 'submit')
    end

    update_state_cache
  end

  def update_state_cache(delay: 0.2)
    Util.set_timeout(
      callback: lambda do
        puts 'Updating game cache'
        Rails.logger.silence { update(state_cache: ActiveModelSerializers::SerializableResource.new(self, { serializer: GameStateSerializer }).to_json) }
      end,
      seconds: delay
    )
  end

  def non_card_czar_users
    users.reject(&:card_czar?)
  end

  def submitted_round_cards
    non_card_czar_users.map(&:submitted_card)
  end

  def select_card_czar
    # when game is started, card czar is selected randomly
    return update(card_czar: users.sample) if card_czar.nil?

    # otherwise, get the next player in a loop
    update(card_czar: users[(users.index(card_czar) + 1) % users.length])
  end

  def select_black_card
    update(black_card: BlackCard.all.sample)
  end

  def winning_card_id
    card_czar = User.find(card_czar_id) # ! hacky solution to it not being up to date
    submitted_round_cards[card_czar.picked_card_index].id
  end

  def winning_user
    non_card_czar_users.select { |user| user.submitted_card.id == winning_card_id }[0]
  end

  def reset_picked_submitted_cards
    users.each { |user| user.update(submitted_hand_index: nil, picked_card_index: nil) }
  end
end
