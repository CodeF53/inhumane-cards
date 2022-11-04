class User < ApplicationRecord
  has_secure_password

  validates :username, presence: true, uniqueness: { case_sensitive: false }

  belongs_to :game, optional: true

  def submitted_card?
    submitted_hand_index.nil?.!
  end

  def submitted_card
    hand[submitted_hand_index]
  end

  def card_czar?
    game.card_czar == self
  end

  def lobby_owner?
    game.lobby_owner == self
  end

  def increment_game_score
    update(game_score: game_score + 1)
  end

  def set_game_vars
    update(
      game_score: 0,
      hand: game.sample_white_cards(10)
    )

    # ? do these updates still need to be separate?
    update(
      submitted_hand_index: nil,
      picked_card_index: nil
    )
  end

  def leave_game
    old_game = game
    update(game_id: nil)

    # if the lobby is now empty, destroy it.
    return old_game.destroy if old_game.users.empty?

    # don't step game out of waiting lobby
    return if %w[lobby over].include?(old_game.game_phase)

    # TODO: when a card czar leaves a game it should pick a new black card and card czar
    # TODO: when lobby owner leaves, assign new owner randomly
    old_game.step_game # if game was waiting on user (to submit or pick), we should advance the game
  end
end
