class GameSerializer < ActiveModel::Serializer
  attributes :id, :host, :password_protected, :num_players

  def host
    object.lobby_leader.username
  end

  def password_protected
    object.password.nil?.!
  end

  def num_players
    object.users.length
  end
end
