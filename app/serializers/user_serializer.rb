class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :game_score, :followed_events, :created_events
end
