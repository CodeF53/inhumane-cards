class Game < ApplicationRecord
  has_many :users
  belongs_to :lobby_owner, class_name: 'User', optional: true
  belongs_to :card_czar, class_name: 'User', optional: true
  belongs_to :black_card, optional: true

  def step_game
    puts "stepping game, phase: #{game_phase}"

    begin
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
            broadcast_state
          end,
          seconds: 0.2
        )

        # wait 15 seconds for users to admire winning combo
        sleep(5)

        non_card_czar_users.each do |user|
          hand = user.hand
          # replace used cards
          hand[user.submitted_hand_index] = sample_white_cards(1) if user.submitted_card?
          # replace discarded cards
          hand[user.discarded_card_index] = sample_white_cards(1) if user.discarded_card?

          user.update(hand: hand)
        end

        puts 'result wait over'
        if winning_user.game_score >= winning_score
          puts "#{winning_user.username} wins"
          update(game_phase: 'over')

          broadcast_state
          return
        else
          puts '   switching back to submit'
          update(game_phase: 'submit') # ! sometimes this just fails and ends the thread operation.

          puts '   selecting new black card and czar'
          select_card_czar
          select_black_card
        end

        reset_picked_submitted_cards
      else # 'lobby' 'over'
        select_card_czar
        select_black_card
        users.each(&:set_game_vars)
        update(game_phase: 'submit')
      end
    rescue
      puts 'some error happened, lets just ignore that and go back to the submit phase...'
      update(game_phase: 'submit') # ! sometimes this just fails and ends the thread operation.
      select_card_czar
      select_black_card
    end

    broadcast_state
  end

  def state
    # ! Game.find(id) hacky solution to it not being up to date
    ActiveModelSerializers::SerializableResource.new(Game.find(id), { serializer: GameStateSerializer }).to_json
  end

  def broadcast_state
    puts 'broadcasting new state'
    GamesChannel.broadcast_to(self, state)
  end

  def non_card_czar_users
    Game.find(id).users.reject(&:card_czar?) # ! hacky solution to it not being up to date
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

  def winning_card_id
    card_czar = User.find(card_czar_id) # ! hacky solution to it not being up to date
    submitted_round_cards[card_czar.picked_card_index].id
  end

  def winning_user
    non_card_czar_users.select { |user| user.submitted_card.id == winning_card_id }[0]
  end

  def reset_picked_submitted_cards
    users.each { |user| user.update(submitted_hand_index: nil, picked_card_index: nil, discarded_card_index: nil) }
  end

  def select_black_card
    # TODO: add id to used_black_card_ids
    # then don't use them again till we run out
    update(black_card_id: black_card_pool.sample.id)
  end

  def sample_white_cards(amount = 1)
    # TODO: add used ids to used_white_card_ids
    # then don't use them again till we run out
    return white_card_pool.sample if amount == 1

    white_card_pool.sample(amount)
  end
end
