class GameStateSerializer < ActiveModel::Serializer
  attributes :id, :game_phase, :winning_score, :users, :card_czar_id, :black_card, :game_stuff, :lobby_owner_id, :enable_discards

  def users
    object.users.sort_by(&:game_score).map do |user|
      ActiveModelSerializers::SerializableResource.new(user).as_json
    end
  end

  def game_stuff
    case object.game_phase
    when 'submit'
      # which users have submitted
      {
        users_submitted: object.non_card_czar_users.select(&:submitted_card?).map(&:id)
      }
    when 'pick'
      # array of card texts
      { cards: object.submitted_round_cards }
    when 'result'
      {
        # array of card texts
        cards: object.submitted_round_cards,
        # user ids for each card
        card_user_ids: object.non_card_czar_users.filter(&:submitted_card?).sort_by { |user| user.submitted_card.id }.map(&:id),
        # winning card id
        winning_card_id: object.winning_card_id,
        # winning user id
        winning_user_id: object.winning_user.id
      }
    when 'over'
      {
        winning_user_id: object.users.max_by(&:game_score).id
      }
    end
  end
end
