# ./lib/processing/blacklist_processing.rb
# processing archive operations

# gems
require 'json'

class Blacklist

  # host and domain regex
  @host = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\\/([0-9]|[1-2][0-9]|3[0-2]))$"
  @domain ="^([a-z0-9]([a-z0-9\\-]{0,70}[a-z0-9])?\\.)+[a-z]{2,6}$"

  # get the current working dir
  @current_dir = Dir.pwd

  #<editor-fold desc="static method : get_blacklist">
  def self.get_blacklist
    # return host or domain from blacklist.json
    return JSON.parse(File.read("#{@current_dir}/../../data_source/blacklist.json"))
  end
  #</editor-fold>

  #<editor-fold desc="static method : save_blacklist">
  def self.save_blacklist(blacklist)
    # save in blacklist.json
    File.open("#{@current_dir}/../../data_source/blacklist.json", 'w') do |list|
      list.write(JSON.pretty_generate(blacklist))
    end
  end
  #</editor-fold>

  #<editor-fold desc="static method : display_blacklist">
  def self.blacklist_display

    # get host and domain
    blacklist = get_blacklist

    # display the blacklisted hosts
    puts '--- host ---'
    blacklist['host'].each do |host|
      puts host
    end

    puts "\n"

    #display the blacklisted domains
    puts '--- domain ---'
    blacklist['domain'].each do |domain|
      puts domain
    end

    puts "\n"

  end
  #</editor-fold>

  #<editor-fold desc="static method : blacklist_add">
  def self.blacklist_add

    # get the current json blacklist
    blacklist = get_blacklist

    # choose a type for new entry (host/domain)
    print 'what do you want to add in blacklist ? [host/domain] : '.alert
    type = gets.chomp

    if type.downcase == 'host' # add a new host

      print 'enter a new host : '.alert
      host = gets.chomp

      # if host is valid and not already in blacklist
      if host.match(@host) && !blacklist.includes?(host)
        blacklist[type].push(host) # push new host
        save_blacklist(blacklist) # save the blacklist

        puts "\n[ OK ] - host was append to blacklist.".valid

      else # invalid host, or already on blacklist
        puts "\n[ ERROR ] - host is invalid or already on blacklist !".error
        exit
      end

    elsif type.downcase == 'domain' # add a new domain

      print 'enter a new domain : '.alert
      domain = gets.chomp

      # if domain is valid, and not already in blacklist
      if domain.match(@domain)
        blacklist[type].push(domain) # push new domain
        save_blacklist(blacklist) # save the blacklist

        puts "\n[ OK ] - domain was append to blacklist.".valid

      else # invalid domain, or already on blacklist
        puts "\n[ ERROR ] - domain is invalid or already on blacklist !".error
        exit
      end

    else
      # bad parameter, expected 'host/domain'
      puts "\n[ ERROR ] - unknown parameter : #{type}, exit.".error
      exit
    end

  end
  #</editor-fold>

  #<editor-fold desc="static method : blacklist_remove">
  def self.blacklist_remove

    # get the current json blacklist
    blacklist = get_blacklist

    print 'enter a blacklisted host or domain for remove it : '.alert
    input = gets.chomp

    # if input is a valid host or domain
    if input.match(@domain) || input.match(@host)

      # if host is on the blacklist
      if blacklist['host'].include?(input)
        blacklist['host'].delete(input) # remove an host
        save_blacklist(blacklist) # save the blacklist

        puts "\n[ OK ] - #{input} have been removed to blacklist !".valid

      # if domain is on blacklist
      elsif blacklist['domain'].include?(input)
        blacklist['domain'].delete(input) # remove an domain
        save_blacklist(blacklist) # save the blacklist

        puts "\n[ OK ] - #{input} have been removed to blacklist.".valid

      else # input is not in blacklist
        puts "\n[ ERROR ] - #{input} is not blacklisted !".error
        exit
      end

    else # bad input, expected an host or domain
      puts "\n[ ERROR ] - unknown input : #{input}, exit.".error
      exit
    end

  end
  #</editor-fold>

end
