module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    # auto kicks users who close tab/window, but dont reopen within 10 seconds
    def disconnect
      Util.set_timeout(callback: lambda do
        if ActionCable.server.connections.map(&:current_user).map(&:id).include?(current_user.id)
          puts "user #{current_user.username} disconnected from game #{current_user.game_id}, but reconnected within the timeout window"
        else
          # ! sometimes connections hang out post-dc, leading to this not happening
          # todo: make consistent
          puts "user #{current_user.username} disconnected from game #{current_user.game_id}, and didn't reconnect within the timeout window"
          current_user.leave_game
        end
      end, seconds: 10)
    end

    private

    def find_verified_user
      user = User.find(cookies.encrypted['_session_id']['user_id'])

      return user unless user.nil?

      reject_unauthorized_connection
    end
  end
end