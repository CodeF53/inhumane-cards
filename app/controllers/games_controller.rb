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
    game.update(lobby_leader: @current_user)
    @current_user.update(game: game)

    render json: game, status: :created
  end

  # GET /game_state
  def show
    authorize
    verify_in_game

    render json: current_game
  end

  # PATCH /start_game
  def start
    authorize
    verify_in_game

    return render json: { errors: ['Not the round leader!'] }, status: :forbidden unless @current_user.round_leader?

    return render json: { errors: ['Game is running'] }, status: :conflict unless current_game.game_phase == 'lobby' || current_game.game_phase == 'over'

    # start game logic loop
    change(game_phase: 'choose')
    current_game.select_round_leader
    current_game.select_black_card
  end

  private

  def current_game
    @current_user.game
  end

  def verify_in_game
    return render json: { errors: ['Not in a game'] }, status: :conflict if current_game.nil?
  end

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
