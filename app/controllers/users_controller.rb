class UsersController < ApplicationController
  def create
    user = User.create!(user_params)
    session[:user_id] = user.id
    render json: user, status: :created
  end
  
  def me
    authorize
    render json: @current_user
  end

  def join_game
    authorize
    found_game = Game.find(param[:game_id])

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
  end

  def submit_card
    confirm_in_game
    verify_phase('submit')

    return render json: { errors: ['Card already submitted'] }, status: :conflict if @current_user.submitted_card?

    return render json: { errors: ['Currently the card czar!'] }, status: :forbidden if @current_user.card_czar?

    @current_user.update(submitted_hand_index: params[:card_index])

    render json: {}, status: :accepted
  end

  def pick_card
    confirm_in_game
    verify_phase('pick')

    return render json: { errors: ['Card already chosen'] }, status: :conflict unless picked_card_index.nil?

    return render json: { errors: ['Not the card czar!'] }, status: :forbidden unless @current_user.card_czar?

    update(picked_card_index: params[:card_index])
    # TODO: run something that checks if we should go to next phase

    render json: {}, status: :accepted
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
