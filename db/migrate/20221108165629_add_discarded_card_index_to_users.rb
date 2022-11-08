class AddDiscardedCardIndexToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :discarded_card_index, :integer
  end
end
