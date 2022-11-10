class UsersController < ApplicationController
  skip_before_action :authorize, only: %i[create]
  before_action :confirm_in_game
  skip_before_action :confirm_in_game, only: %i[create me join_game]

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

    return render json: { errors: ['Invalid Password'] }, status: :unauthorized unless found_game.password.nil? || found_game.password == params[:password]

    return render json: { errors: ['Game Full'] }, status: :gone if found_game.users.length == :player_limit

    @current_user.update(game: found_game)
    @current_user.set_game_vars
    # TODO: broadcast user join
    @game.broadcast_state

    render json: {}, status: :accepted
  end

  def leave_game
    @current_user.leave_game

    render json: {}, status: :accepted
  end

  def submit_card
    return unless verify_phase('submit').nil?

    return render json: { errors: ['Card already submitted'] }, status: :conflict if @current_user.submitted_card?

    return render json: { errors: ['Currently the card czar!'] }, status: :forbidden if @current_user.card_czar?

    @current_user.update(submitted_hand_index: params[:card_index])

    sleep(0.1)
    @game.step_game

    render json: {}, status: :accepted
  end

  def discard_card
    return unless verify_phase('submit').nil?

    return render json: { errors: ['Discarding disabled'] }, status: :conflict unless @game.enable_discards

    return render json: { errors: ['Card already discarded this round'] }, status: :conflict if @current_user.discarded_card?

    @current_user.update(discarded_card_index: params[:card_index])

    render json: {}, status: :accepted
  end

  def pick_card
    return unless verify_phase('pick').nil?

    return render json: { errors: ['Card already picked'] }, status: :conflict unless @current_user.picked_card_index.nil?

    return render json: { errors: ['Not the card czar!'] }, status: :forbidden unless @current_user.card_czar?

    @current_user.update(picked_card_index: params[:card_index])

    @game.step_game

    render json: {}, status: :accepted
  end

  # PATCH /start_game
  def start
    return render json: { errors: ['Not the lobby owner!'] }, status: :forbidden unless @current_user.lobby_owner?

    return render json: { errors: ['Game is already running'] }, status: :conflict unless @game.game_phase == 'lobby' || @game.game_phase == 'over'

    return render json: { errors: ['Not enough players'] }, status: :conflict unless @game.users.length >= 3

    @game.step_game
  end

  # GET /hand
  def hand
    render json: @current_user.hand.map(&:text).to_json
  end

  # POST /kick/:user_id
  def kick
    return render json: { errors: ['Not the lobby owner!'] }, status: :forbidden unless @current_user.lobby_owner?

    user_to_kick = @game.users.find(params[:user_id])

    user_to_kick.leave_game

    # TODO: add message for getting kicked

    render json: {}, status: :accepted
  end

  # POST /promote/:user_id
  def promote
    return render json: { errors: ['Not the lobby owner!'] }, status: :forbidden unless @current_user.lobby_owner?

    user_to_promote = @game.users.find(params[:user_id])

    @game.update(lobby_owner_id: user_to_promote.id)

    # TODO: broadcast user promotion
    @game.broadcast_state

    render json: {}, status: :accepted
  end

  private

  def verify_phase(phase)
    return if @game.game_phase == phase

    render json: { errors: ["Game not in #{phase} phase!"] }, status: :forbidden
  end

  def confirm_in_game
    Rails.logger.silence { @game = @current_user.game }
    return render json: { errors: ['Not in a game'] }, status: :conflict if @game.nil?
  end

  def user_params
    params.permit(:username, :password)
  end
end
