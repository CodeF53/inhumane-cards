class GameStateSerializer < ActiveModel::Serializer
  attributes :id, :game_phase, :winning_score, :users, :card_czar_id, :black_card, :game_stuff, :lobby_owner_id

  def users
    object.users.map do |user|
      ActiveModelSerializers::SerializableResource.new(user).as_json
    end
  end

  def game_stuff
    case object.game_phase
    when 'submit'
      # which users have submitted
      object.non_card_czar_users.select(&:submitted_card?).map(&:id)
    when 'pick'
      # array of card texts
      { cards: object.submitted_round_cards }
    when 'result'
      {
        # array of card texts
        cards: object.submitted_round_cards,
        # user ids for each card
        card_user_ids: object.non_card_czar_users.map(&:id),
        # winning card id
        winning_card_id: object.winning_card_id,
        # winning user id
        winning_user_id: object.winner.id
      }
    when 'over'
      {
        winning_user_id: object.winner
      }
    else
      'random shit'
    end
  end
end
