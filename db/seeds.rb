puts '🗑️ Clearing database'
BlackCard.destroy_all
WhiteCard.destroy_all

begin
  puts "\n📁 Reading cards file"
  card_file = File.read('./cah-cards-full.json')
rescue Errno::ENOENT
  puts '❌ ./cah-cards-full.json not found!'
  puts 'Download it from https://crhallberg.com/cah/ '
else
  cards_json = JSON.parse(card_file)

  cards_json.each do |set|
    # make the category it belongs to if it doesn't already exist

    # create the card set

    # add cards to the set
    puts "\n⌛ Loading cards from #{set['name']}"

    unless set['white'].empty?
      progressbar = ProgressBar.create(title: "      #{set['white'].length} White cards", total: set['white'].length)

      set['white'].each do |card|
        WhiteCard.create(text: card['text'])
        # TODO: save card.pack for something
        progressbar.increment
      end
    end

    next if set['black'].empty?

    progressbar = ProgressBar.create(title: "      #{set['black'].length} Black cards", total: set['black'].length)

    set['black'].each do |card|
      BlackCard.create(text: card['text']) if card['pick'] == 1
      # TODO: implement support for cards with card.pick > 1
      progressbar.increment
    end
  end
end
