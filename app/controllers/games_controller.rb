class GamesController < ApplicationController
  # GET /games
  def index
    render json: Game.all
  end

  # POST /games
  def create
    authorize
    game = Game.create!(game_params, user: @current_user)

    render json: game, status: :created
  end

  # GET /game_state
  def show
    authorize
    return render json: { errors: ['Not in a game'] }, status: :conflict if @current_user.game.nil?

    render json: Game.find(params[:id])
  end

  private

  # Only allow a list of trusted parameters through.
  def game_params
    params.require(:game).permit(
      :winning_score,
      :max_choose_phase_time,
      :max_pick_phase_time,
      :result_phase_time,
      :hand_size,
      :password
    )
  end
end
