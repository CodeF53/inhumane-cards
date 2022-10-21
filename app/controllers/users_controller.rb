class UsersController < ApplicationController
  def create
    user = User.create!(user_params)
    session[:user_id] = user.id
    render json: user, status: :created
  end

  def show
    authorize
    render json: @current_user
  end

  def join_game
    authorize
    found_game = Game.find(param[:game_id])

    unless found_game.password.nil? || found_game.password != params[:password]
      return render json: { errors: ['Invalid game password'] }, status: :unauthorized
    end

    @current_user.update(game: found_game)

    @current_user.set_game_vars

    # TODO: figure out correct response to give here
  end

  def leave_game
    authorize
    confirm_in_game

    @current_user.update(game_id: nil)

    # TODO: figure out correct response to give here
  end

  def choose_card
    authorize
    confirm_in_game
    verify_phase('choose')

    return render json: { errors: ['Card already chosen'] }, status: :conflict unless @current_user.not_chosen_card?

    return render json: { errors: ['Currently the round leader!'] }, status: :forbidden if @current_user.round_leader?

    @current_user.update(chosen_hand_index: params[:card_index])

    # TODO: figure out correct response to give here
  end

  def pick_card
    authorize
    confirm_in_game
    verify_phase('pick')

    return render json: { errors: ['Card already chosen'] }, status: :conflict unless picked_card_index.nil?

    return render json: { errors: ['Not the round leader!'] }, status: :forbidden unless @current_user.round_leader?

    update(picked_card_index: params[:card_index])

    # TODO: figure out correct response to give here
  end

  private

  def verify_phase(phase)
    return if @current_user.game.game_phase == phase

    render json: { errors: ["Game not in #{phase} phase!"] }, status: :forbidden
  end

  def confirm_in_game
    return render json: { errors: ['Not in a game'] }, status: :conflict if @current_user.game.nil?
  end

  def user_params
    params.permit(:username, :password)
  end
end
