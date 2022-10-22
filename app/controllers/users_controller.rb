class UsersController < ApplicationController
  skip_before_action :authorize, only: %i[create]

  def create
    user = User.create!(user_params)
    session[:user_id] = user.id
    render json: user, status: :created
  end

  def me
    render json: @current_user
  end

  def join_game
    found_game = Game.find(params[:game_id])

    unless found_game.password.nil? || found_game.password != params[:password]
      return render json: { errors: ['Invalid game password'] }, status: :unauthorized
    end

    return render json: { errors: ['Game full'] }, status: :gone if found_game.users.length == :player_limit

    @current_user.update(game: found_game)
    @current_user.set_game_vars

    render json: {}, status: :accepted
  end

  def leave_game
    confirm_in_game

    @current_user.update(game_id: nil)

    render json: {}, status: :accepted

    step_game # if game was waiting on user (to submit or pick), we should advance the game
  end

  def submit_card
    confirm_in_game
    verify_phase('submit')

    return render json: { errors: ['Card already submitted'] }, status: :conflict if @current_user.submitted_card?

    return render json: { errors: ['Currently the card czar!'] }, status: :forbidden if @current_user.card_czar?

    @current_user.update(submitted_hand_index: params[:card_index])

    @game.step_game

    render json: {}, status: :accepted
  end

  def pick_card
    confirm_in_game
    verify_phase('pick')

    return render json: { errors: ['Card already chosen'] }, status: :conflict unless picked_card_index.nil?

    return render json: { errors: ['Not the card czar!'] }, status: :forbidden unless @current_user.card_czar?

    update(picked_card_index: params[:card_index])

    @game.step_game

    render json: {}, status: :accepted
  end

  # PATCH /start_game
  def start
    confirm_in_game

    return render json: { errors: ['Not the lobby owner!'] }, status: :forbidden unless @current_user.lobby_owner?

    return render json: { errors: ['Game is already running'] }, status: :conflict unless @game.game_phase == 'lobby' || @game.game_phase == 'over'

    # TODO: add check if atleast 4 players are in the lobby

    @game.step_game
  end

  # GET /game_state
  def game_state
    confirm_in_game

    render json: @game, serializer: GameStateSerializer
  end

  private

  def verify_phase(phase)
    return if @game.game_phase == phase

    render json: { errors: ["Game not in #{phase} phase!"] }, status: :forbidden
  end

  def confirm_in_game
    @game = @current_user.game
    return render json: { errors: ['Not in a game'] }, status: :conflict if @game.nil?
  end

  def user_params
    params.permit(:username, :password)
  end
end
