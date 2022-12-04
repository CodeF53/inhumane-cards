class User < ApplicationRecord
  has_secure_password

  validates :username,
    presence: true,
    uniqueness: { case_sensitive: false },
    length: { minimum: 3, maximum: 16 },
    format: { with: /^(\w|-)*$/ }

  belongs_to :game, optional: true

  # game logic methods
  def leave_game
    # dont break if the user isn't even in a game
    return if game_id.nil?
    return update(game_id: nil) if game.nil?

    # if the lobby is now empty, destroy it.
    return game.destroy if game.users.length <= 1

    # return to submit phase when lobby card czar leaves && game state is in a play mode
    game.switch_to_submit if card_czar? && %w[lobby over].exclude?(game.game_phase)

    old_game = game
    update(game_id: nil)

    # when lobby owner leaves, assign new owner randomly
    old_game.update(lobby_owner: old_game.users.sample) if old_game.lobby_owner == self

    # broadcast new state
    old_game.broadcast_state

    # don't step game out of waiting lobby
    return if %w[lobby over].include?(old_game.game_phase)

    old_game.step_game # if game was waiting on user (to submit or pick), we should advance the game
  end

  def join_game(game)
    # leave old lobby if inside one
    leave_game

    # set ping so not kicked instant they join by cable
    update_ping_input_times
    # join the game
    update(
      game: game,
      game_score: 0,
      submitted_hand_index: nil,
      picked_card_id: nil,
      discarded_card_index: nil
    )

    # let everyone else know that we are here
    game.broadcast_state
  end

  # helper boolean methods
  def discarded_card?
    discarded_card_index.nil?.!
  end

  def submitted_card?
    submitted_hand_index.nil?.!
  end

  def card_czar?
    game.card_czar == self
  end

  def lobby_owner?
    game.lobby_owner == self
  end

  # helper value methods
  def submitted_card
    hand[submitted_hand_index]
  end

  # setter methods
  def update_ping_time
    update(last_ping: DateTime.now.to_i)
  end

  def update_input_time
    update(last_input: DateTime.now.to_i)
  end

  def update_ping_input_times
    update(last_ping: DateTime.now.to_i, last_input: DateTime.now.to_i)
  end

  def increment_game_score
    update(game_score: game_score + 1)
  end

  def set_game_vars
    update(
      hand: game.sample_white_cards(10),
      submitted_hand_index: nil,
      picked_card_id: nil,
      discarded_card_index: nil,
      game_score: 0
    )
  end
end
