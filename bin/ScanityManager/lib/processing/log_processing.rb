# ./lib/processing/server.rb
# processing logs management
# Created by : Erenox the : 02/12/2016
# Last update : 02/12/2016


# private core gems
require_relative('../core/string_overwrite.rb')

class Log

  @bin_dir = "#{Dir.pwd}/.."

  #<editor-fold desc="static method : log_manager">
  def self.log_manager(type, action)

    # get log file by type
    log = "#{@bin_dir}/../logs/#{type}.log"

    if File.file?(log)
      if action == 'display'
        puts "[ OK ] - display #{type} log.".valid
        system("cat #{log}")
        puts "\n"
      elsif action == 'remove'
        puts "[ OK ] - remove #{type} log.".valid
        system("rm #{log}")
      else
        puts '[ Error ] - unknown action to do with log.'.error
      end
    else
      puts "[ Error ] - #{type} log not found.".error
    end
  end
  #</editor-fold>

  #<editor-fold desc="static method : log_client">
  def self.log_client
    puts '¤ display the client log.'
    log_manager('client','display')
  end
  #</editor-fold>

  #<editor-fold desc="static method : log_server">
  def self.log_server
    puts '¤ display the server log.'
    log_manager('server','display')
  end
  #</editor-fold>

  #<editor-fold desc="static method : log_remove_client">
  def self.log_remove_client
    puts '¤ remove the client log.'
    log_manager('client','remove')
  end
  #</editor-fold>

  #<editor-fold desc="static method : log_remove_server">
  def self.log_remove_server
    puts '¤ remove the server log.'
    log_manager('server','remove')
  end
  #</editor-fold>

end