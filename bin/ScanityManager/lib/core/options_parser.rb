# ./lib/options_parser.rb
# Display menu and parse inputs
# Created by : Erenox the : 27/10/2016
# Last update : 28/10/2016

# private gems
require_relative './banner_display.rb'
require_relative '../core/gems_manager.rb'

# gems
Gems.manage_gems do
  require 'optparse'
  require 'ostruct'
end

class OptionsParser
  #<editor-fold desc="class constructor : initialize">
  # class constructor
  def initialize(argv)
    @argv = argv

    # instance Banner class
    @banner = Banner.new('slant', '2.1.8', 'Jackson (stable)', true)

  end
  #</editor-fold>

  #<editor-fold desc="method : parse">
  # Return a structure describing the options.
  def parse

    # display the banner
    @banner.display_banner

    # if argv is empty
    if @argv.empty?
      ARGV << '-h'
    end

    options = OpenStruct.new
    opt_parser = OptionParser.new do|opts|

      opts.banner = 'usage: server_manager.rb -opt [ACTION]'

      opts.on('-d', '--deploy ¤', [:install], 'manage the deployment :', '¤ install', "\n") do |action|
        return "deploy_#{action}" # return point
      end

      opts.on('-s', '--server ¤', [:start, :stop, :restart, :status], 'manage the server :', '¤ start', '¤ stop', '¤ restart', '¤ status', "\n") do |action|
        return "server_#{action}" # return point
      end

      opts.on('-u','--update ¤',[:server, :system_packages, :system_core], 'manage the updates :', '¤ server', '¤ system_packages', '¤ system_core',"\n") do |action|
        return "update_#{action}" # return point
      end

      opts.on('-a','--archive ¤', [:display, :remove, :remove_all, :import, :export], 'manage the archives :', '¤ display', '¤ remove', '¤ remove_all', '¤ import', '¤ export',"\n") do |action|
        return "archive_#{action}" # return point
      end

      opts.on('-b','--blacklist ¤', [:display, :add, :remove], 'manage the blacklist :', '¤ display', '¤ add', '¤ remove', "\n") do |action|
        return "blacklist_#{action}" # return point
      end

      opts.on('-l','--log ¤', [:client, :server, :remove_client, :remove_server], 'manage the logs :', '¤ client', '¤ server', '¤ remove_client', '¤ remove_server', "\n") do |action|
        return "log_#{action}" # return point
      end

      opts.on('-h', '--help', 'display help') do
        puts opts
        exit
      end
    end

    begin
      opt_parser.parse!(@argv)

    rescue OptionParser::ParseError => e
      puts "#{e}".error
      exit
    end

  end
  #</editor-fold>

end 
