class UsersController < ApplicationController
  def create
    user = User.create!(user_params)
    session[:user_id] = user.id
    render json: user, status: :created
  end

  def show
    render json: @current_user
  end

  def join_game
    authorize
    return render json: { errors: ['Already in a game'] }, status: :conflict unless game.nil?

    found_game = Game.find(param[:game_id])

    unless found_game.password.nil? || found_game.password != params[:password]
      return render json: { errors: ['Invalid game password'] }, status: :unauthorized
    end

    update(game: found_game)

    # TODO: figure out correct response to give here
  end

  def leave_game
    authorize
    return render json: { errors: ['Not in a game'] }, status: :conflict if game.nil?

    update(game_id: nil)

    # TODO: figure out correct response to give here
  end

  def choose_card
    authorize
    return render json: { errors: ['Not in a game'] }, status: :conflict if game.nil?

    return render json: { errors: ['Game not in choose phase!'] }, status: :forbidden unless game.game_phase == 'choose'

    return render json: { errors: ['Currently the round leader!'] }, status: :forbidden if game.round_leader == self

    update(chosen_hand_index: params[:card_index])

    # TODO: figure out correct response to give here
  end

  def pick_card
    authorize
    return render json: { errors: ['Not in a game'] }, status: :conflict if game.nil?

    return render json: { errors: ['Game not in pick phase!'] }, status: :forbidden unless game.game_phase == 'pick'

    return render json: { errors: ['Not the round leader!'] }, status: :forbidden unless game.round_leader == self

    update(picked_card_index: params[:card_index])

    # TODO: figure out correct response to give here
  end

  private

  def user_params
    params.permit(:username, :password)
  end
end
