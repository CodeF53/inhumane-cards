class GamesController < ApplicationController
  # GET /games
  def index
    render json: Game.all
  end

  # GET /games/1
  def show
    render json: Game.find(params[:id])
  end

  # POST /games
  def create
    game = Game.create!(game_params)

    render json: game, status: :created
  end

  private

  # Only allow a list of trusted parameters through.
  def game_params
    params.require(:game).permit(
      :lobby_leader_id,
      :winning_score,
      :max_choose_phase_time,
      :max_pick_phase_time,
      :result_phase_time,
      :hand_size,
      :password
    )
  end
end
