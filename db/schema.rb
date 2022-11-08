# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_11_08_173832) do
  create_table "black_cards", force: :cascade do |t|
    t.string "text"
    t.integer "pick", default: 1
    t.integer "card_pack_id", null: false
    t.index ["card_pack_id"], name: "index_black_cards_on_card_pack_id"
  end

  create_table "card_categories", force: :cascade do |t|
    t.string "title"
    t.boolean "is_official"
  end

  create_table "card_packs", force: :cascade do |t|
    t.string "title"
    t.integer "card_category_id"
    t.index ["card_category_id"], name: "index_card_packs_on_card_category_id"
  end

  create_table "games", force: :cascade do |t|
    t.integer "winning_score"
    t.integer "player_limit"
    t.string "password"
    t.integer "lobby_owner_id"
    t.integer "black_card_id"
    t.integer "card_czar_id"
    t.string "game_phase", default: "lobby"
    t.string "state_cache"
    t.string "black_card_pool"
    t.string "white_card_pool"
    t.string "used_white_card_ids"
    t.string "used_black_card_ids"
    t.boolean "enable_discards", default: false
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "password_digest"
    t.integer "game_id"
    t.integer "game_score"
    t.integer "submitted_hand_index"
    t.integer "picked_card_index"
    t.text "hand"
    t.integer "discarded_card_index"
  end

  create_table "white_cards", force: :cascade do |t|
    t.string "text"
    t.integer "card_pack_id", null: false
    t.index ["card_pack_id"], name: "index_white_cards_on_card_pack_id"
  end

  add_foreign_key "black_cards", "card_packs"
  add_foreign_key "card_packs", "card_categories"
  add_foreign_key "white_cards", "card_packs"
end
