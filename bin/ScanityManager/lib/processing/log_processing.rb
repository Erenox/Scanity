# ./lib/processing/log_processing.rb
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
        
      elsif action == 'clear'
        puts "[ OK ] - clear #{type} log.".valid
        system("echo '' > #{log}")
        
      else
        puts '[ Error ] - unknown action.'.error
      end
      
    else
      puts "[ Error ] - #{type} log not found.".error
    end
    
  end
  #</editor-fold>

  #<editor-fold desc="static method : log_client">
  def self.log_client
    puts '¤ display client log file.'
    log_manager('client','display')
  end
  #</editor-fold>

  #<editor-fold desc="static method : log_server">
  def self.log_server
    puts '¤ display server log file.'
    log_manager('server','display')
  end
  #</editor-fold>

  #<editor-fold desc="static method : log_remove_client">
  def self.log_clear_client
    puts '¤ clear client log file.'
    log_manager('client','clear')
  end
  #</editor-fold>

  #<editor-fold desc="static method : log_remove_server">
  def self.log_clear_server
    puts '¤ clear server log file.'
    log_manager('server','clear')
  end
  #</editor-fold>

end
