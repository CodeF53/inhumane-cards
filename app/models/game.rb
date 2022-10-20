class Game < ApplicationRecord
  has_many :users
  belongs_to :lobby_leader, class_name: 'User', foreign_key: 'lobby_leader_id', optional: true
  belongs_to :round_leader, class_name: 'User', foreign_key: 'round_leader_id', optional: true
  belongs_to :black_card, optional: true

  def non_round_leader_users
    users.reject(&:round_leader)
  end

  def chosen_round_cards
    non_round_leader_users.map(&:chosen_card)
  end

  def select_round_leader
    # when game is started, leader is selected randomly
    return change(round_leader: user.select) if round_leader.nil?

    # otherwise, get the next player in a loop
    change(round_leader: users[(users.index(round_leader) + 1) % users.length])
  end

  def select_black_card
    change(black_card: BlackCard.select)
  end

  def replace_used_cards
    non_round_leader_users.each do |user|
      cards = user.cards
      cards[user.chosen_hand_index] = WhiteCard.select
      user.change(cards: cards)
    end
  end
end

=begin
game clock
  switch game_phase
  'lobby'
    wait a bit
    game clock
  'choose'
    game_phase = 'pick' if non_round_leader_users.all?(&:chosen_card?)

    # only force next game phase if:
    # - waited longer than max_choose_phase_time
    # - make sure there is enough submitted cards (atleast 2)
    if waited longer than max_choose_phase_time && non_round_leader_users.select(&:chosen_card) >= 2
      game_phase = 'pick'
      # ?: maybe game option kick_afk_players
    end

    wait a bit
    game clock
  'pick'
    game_phase = 'result' unless round_leader.picked_card_index.nil?

    # if waited longer than max_pick_phase_time
    #   TODO: figure out what the hell to do if this happens
    #   game_phase = 'result'
    # end

    wait a bit
    game clock
  'result'
    # get and store round winning card/player
    @round_winning_card = chosen_round_cards[round_leader.picked_card_index]
    @round_winner = non_round_leader_users.find_by(chosen_card: round_winning_card)

    # increment score of round winning player
    @round_winner.increment_game_score

    wait result_phase_time

    replace_used_cards
    select_round_leader
    select_black_card

    if @round_winner.game_score == winning_score
      change(game_phase: 'over')
      @game_winner = @round_winner
    else
      change(game_phase: 'choose')
    end
end
=end
