class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :game_score
end
