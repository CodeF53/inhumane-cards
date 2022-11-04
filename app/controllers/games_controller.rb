class GamesController < ApplicationController
  skip_before_action :authorize, only: %i[index]

  # GET /games
  def index
    return render json: [] if Game.all.empty?

    render json: Game.all
  end

  # POST /games
  def create
    return render json: { errors: ['Must select at least one pack'] }, status: :unprocessable_entity if params[:enabled_pack_ids].empty?

    game = Game.create!(game_params)
    game.update(lobby_owner: @current_user)

    # parse array of pack ids into 2 arrays cards, white and black
    card_packs = params[:enabled_pack_ids].map { |pack_id| CardPack.find(pack_id) }
    game.update(
      white_card_pool: card_packs.map(&:white_card_hash).flatten,
      black_card_pool: card_packs.map(&:black_card_hash).flatten
    )

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
