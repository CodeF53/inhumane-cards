class Game < ApplicationRecord
  has_many :users
  belongs_to :lobby_owner, class_name: 'User', foreign_key: 'lobby_owner_id', optional: true
  belongs_to :card_czar, class_name: 'User', foreign_key: 'card_czar_id', optional: true
  belongs_to :black_card, optional: true

  # ! cursed, no better way I could think of to get the user for the game_state_serializer
  attr_accessor :current_user

  # ! only should be ran once
  def start_clock
    Thread.new do
      loop do
        sleep 30

        # TODO: kick users who are no longer online

        # destroy self if empty
        return destroy if users.empty?
      end
    end
  end

  def step_game
    case game_phase
    when 'submit'
      update(game_phase: 'pick') if non_card_czar_users.all?(&:submitted_card?)
      # TODO: randomize card order
    when 'pick'
      # return to submit phase if card czar left
      if card_czar.nil?
        update(game_phase: 'submit')
        select_card_czar
        select_black_card
        # reset the submitted/picked cards
        users.each { |user| user.update(submitted_hand_index: nil, picked_card_index: nil) }
        return
      end

      # errogntsrhls
      # TODO: FIX ! somehow picked_card_index isn't set here, but is outside of this, despite a set_timeout
      # ! WHY ARE THESE TWO DIFFERENT????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
      pp User.find(card_czar_id) # => picked_card_index: "1"
      pp card_czar # => picked_card_index: nil  -  WHYYYYYYYYYYYYYYYYYY
      unless card_czar.picked_card_index.nil?
        update(game_phase: 'submit')
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
      sleep(15)

      # replace used cards
      non_card_czar_users.each do |user|
        hand = user.hand
        hand[user.submitted_hand_index] = WhiteCard.all.sample.id
        user.update(hand: hand)
      end

      # reset the submitted/picked cards
      users.each { |user| user.update(submitted_hand_index: nil, picked_card_index: nil) }

      if winning_user.game_score >= winning_score
        update(game_phase: 'over')
      else
        update(game_phase: 'submit')
        select_card_czar
        select_black_card
      end
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
        puts 'Updating cache:'
        puts "users - #{users.length}"
        update(state_cache: ActiveModelSerializers::SerializableResource.new(self, { serializer: GameStateSerializer }).to_json)
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
    submitted_round_cards[card_czar.picked_card_index].id
  end

  def winning_user
    non_card_czar_users.select { |user| user.submitted_card.id == winning_card_id }[0]
  end
end
