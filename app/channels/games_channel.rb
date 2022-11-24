class GamesChannel < ApplicationCable::Channel
  periodically :check_pings, every: 5.seconds

  def subscribed
    stop_all_streams
    game = Game.find(params[:game_id])
    stream_for game
  end

  def unsubscribed
    stop_all_streams
  end

  def check_pings
    Rails.logger.silence do
      Game.all.each do |game|
        game.users.each do |user|
          ping_time_diff = DateTime.now.to_i - user.last_ping
          user.leave_game if ping_time_diff > 10 # auto kick if not pinged in last 10 seconds

          # TODO: add auto kick for last input here
        end
      end
    end
  end

  def ping
    Rails.logger.silence { current_user.update(last_ping: DateTime.now.to_i) }
  end
end
