class GamesChannel < ApplicationCable::Channel
  def subscribed
    stop_all_streams
    game = Game.find(params[:game_id])
    stream_for game
  end

  def unsubscribed
    stop_all_streams
  end
end