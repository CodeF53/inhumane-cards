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
      when 'pick'
        # switch to result phase when winning card is picked
        card_czar = User.find(card_czar_id) # ! hacky solution to it not being up to date
        unless card_czar.picked_card_id.nil?
          puts 'card czar has picked winner, switching to result phase and stepping again'
          update(game_phase: 'result')
          step_game
          return
        end
      when 'result'
        # increment score of round winning player
        winning_user.increment_game_score
        broadcast_state

        # wait 5 seconds for users to admire winning combo
        sleep(5)
        puts 'result wait over'

        puts 'checking if a user has won'
        if (winning_user.game_score + 1) >= winning_score
          puts "#{winning_user.username} wins"
          update(game_phase: 'over')
        else
          puts 'replacing used/discarded cards'
          non_card_czar_users.each do |user|
            hand = user.hand
            # replace used cards
            hand[user.submitted_hand_index] = sample_white_cards[0] if user.submitted_card?
            # replace discarded cards
            hand[user.discarded_card_index] = sample_white_cards[0] if user.discarded_card?

            user.update(hand: hand)
          end

          switch_to_submit
        end
      else # 'lobby' 'over'
        users.each(&:set_game_vars)
        switch_to_submit
      end
    rescue => e
      puts e.backtrace
      puts 'some error happened, lets just ignore that and go back to the submit phase...'
      switch_to_submit
    end

    broadcast_state
  end

  def state
    # ! Game.find(id) hacky solution to it not being up to date
    Rails.logger.silence { ActiveModelSerializers::SerializableResource.new(Game.find(id), { serializer: GameStateSerializer }).to_json }
  end

  def broadcast_state
    puts 'broadcasting new state'
    Rails.logger.silence { GamesChannel.broadcast_to(self, state) }
  end

  def non_card_czar_users
    Game.find(id).users.reject(&:card_czar?) # ! hacky solution to it not being up to date
  end

  def submitted_round_cards
    non_card_czar_users.filter(&:submitted_card?).map(&:submitted_card).sort_by(&:id)
  end

  def select_card_czar
    # when game is started, card czar is selected randomly
    return update(card_czar: users.sample) if card_czar.nil?

    sorted_users = users.sort_by(&:id)

    # otherwise, get the next player in a loop
    update(card_czar: sorted_users[(sorted_users.index(card_czar) + 1) % sorted_users.length])
  end

  def winning_card_id
    card_czar = User.find(card_czar_id) # ! hacky solution to it not being up to date
    card_czar.picked_card_id
  end

  def winning_user
    non_card_czar_users.filter(&:submitted_card?).select { |user| user.submitted_card.id == winning_card_id }[0]
  end

  def reset_picked_submitted_cards
    users.each { |user| user.update(submitted_hand_index: nil, picked_card_id: nil, discarded_card_index: nil) }
  end

  def select_black_card
    update(used_black_card_ids: []) if (used_black_card_ids.length + 1) >= black_card_pool.length

    filtered_pool = black_card_pool.filter { |card| used_black_card_ids.exclude?(card.id) }

    card_id = filtered_pool.sample.id

    update(black_card_id: card_id, used_black_card_ids: used_black_card_ids << card_id)
  end

  def sample_white_cards(amount = 1)
    update(used_white_card_ids: []) if (used_white_card_ids.length + amount) >= white_card_pool.length

    filtered_pool = white_card_pool.filter { |card| used_white_card_ids.exclude?(card.id) }

    out = [filtered_pool.sample] if amount == 1
    out = filtered_pool.sample(amount) if amount > 1

    update(used_white_card_ids: (used_white_card_ids << out.map(&:id)).flatten)

    out
  end

  def switch_to_submit
    puts 'switching to submit'
    update(game_phase: 'submit')

    puts '\tselecting new black card and czar'
    select_card_czar
    select_black_card

    puts '\tresetting submitted/picked cards'
    reset_picked_submitted_cards
  end
end
