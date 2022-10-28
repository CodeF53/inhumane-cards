class GamesController < ApplicationController
  # GET /games
  def index
    return render json: [] if Game.all.empty?

    render json: Game.all
  end

  # POST /games
  def create
    authorize
    game = Game.create!(game_params)
    game.update(lobby_owner: @current_user)

    # hacky, should probably run user#join_game
    @current_user.update(game: game)
    @current_user.set_game_vars

    game.update_state_cache

    render json: game, status: :created
  end

  private

  # Only allow a list of trusted parameters through.
  def game_params
    params.require(:game).permit(
      :winning_score,
      :password,
      :player_limit
    )
  end
end
