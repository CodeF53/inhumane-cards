every '@reboot' do
  command 'sleep 30 && source /home/f53/.rvm/scripts/rvm && cd /home/f53/inhumane-cards && bundle exec rails s -e production'
end