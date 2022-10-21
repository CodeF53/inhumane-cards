class Game < ApplicationRecord
  has_many :users
  belongs_to :lobby_owner, class_name: 'User', foreign_key: 'lobby_owner_id', optional: true
  belongs_to :card_czar, class_name: 'User', foreign_key: 'card_czar_id', optional: true
  belongs_to :black_card, optional: true

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

  def replace_used_cards
    non_card_czar_users.each do |user|
      cards = user.cards
      cards[user.submitted_hand_index] = WhiteCard.select
      user.change(cards: cards)
    end
  end
end

=begin
game clock
  'submit'
    game_phase = 'pick' if non_card_czar_users.all?(&:submitted_card?)

    wait a bit
    game clock
  'pick'
    game_phase = 'result' unless card_czar.picked_card_index.nil?

    wait a bit
    game clock
  'result'
    # get and store round winning card/player
    @round_winning_card = submitted_round_cards[card_czar.picked_card_index]
    @round_winner = non_card_czar_users.find_by(submitted_card: round_winning_card)

    # increment score of round winning player
    @round_winner.increment_game_score

    wait 15 seconds

    replace_used_cards
    select_card_czar
    select_black_card

    if @round_winner.game_score == winning_score
      change(game_phase: 'over')
      @game_winner = @round_winner
    else
      change(game_phase: 'submit')
    end
end
=end
