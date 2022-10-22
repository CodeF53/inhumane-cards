class Game < ApplicationRecord
  has_many :users
  belongs_to :lobby_owner, class_name: 'User', foreign_key: 'lobby_owner_id', optional: true
  belongs_to :card_czar, class_name: 'User', foreign_key: 'card_czar_id', optional: true
  belongs_to :black_card, optional: true

  def step_game
    case game_phase
    when 'submit'
      update(game_phase: 'pick') if non_card_czar_users.all?(&:submitted_card?)
      # TODO: randomize card order
      # TODO: tell clients new info
    when 'pick'
      unless card_czar.picked_card_index.nil
        update(game_phase: 'result')
        step_game
      end
    when 'result'
      # increment score of round winning player
      @winning_card_id = submitted_round_cards[card_czar.picked_card_index]
      @winner = non_card_czar_users.find_by(submitted_card_id: @winning_card_id)
      @winner.increment_game_score

      # TODO: tell clients new info

      # wait 15 seconds for users to admire winning combo
      sleep(15)

      # replace used cards
      non_card_czar_users.each do |user|
        cards = user.cards
        cards[user.submitted_hand_index] = WhiteCard.all.select
        user.change(cards: cards)
      end

      if @winner.game_score == winning_score
        change(game_phase: 'over')
      else
        change(game_phase: 'submit')
        select_card_czar
        select_black_card
      end
      # TODO: tell clients new info
    else # 'lobby' 'over'
      select_card_czar
      select_black_card
      users.each(&:set_game_vars)
      change(game_phase: 'submit')
      # TODO: tell clients new info
    end
  end

  def non_card_czar_users
    users.reject(&:card_czar)
  end

  def submitted_round_cards
    non_card_czar_users.map(&:submitted_card)
  end

  def select_card_czar
    # when game is started, card czar is selected randomly
    return change(card_czar: user.select) if card_czar.nil?

    # otherwise, get the next player in a loop
    change(card_czar: users[(users.index(card_czar) + 1) % users.length])
  end

  def select_black_card
    change(black_card: BlackCard.all.sample)
  end
end
