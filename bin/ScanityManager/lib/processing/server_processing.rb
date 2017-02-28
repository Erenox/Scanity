# ./lib/processing/server_processing.rb
# Processing server operations
# Created by : Erenox the : 28/10/2016
# Last update : 02/12/2016

# private core gems
require_relative '../core/string_overwrite.rb'
require_relative '../core/mongo_manager.rb'
require_relative '../core/services_manager.rb'
require_relative '../core/approval_manager.rb'

# private processing gems
require_relative './archive_processing.rb'

class Server

  @bin_dir = "#{Dir.pwd}/.."

  #<editor-fold desc="static method : node_start">
  def self.node_start
    System.exec('starting node.js service.',"cd #{@bin_dir} && sudo forever start --killSignal SIGKILL --minUptime 1000 --spinSleepTime 1000 -s -a -l /dev/null -e #{@bin_dir}/../logs/server.log www",'node.js service is running.', 'failed to start node.js service.')
  end
  #</editor-fold>

  #<editor-fold desc="static method : node_stop">
  def self.node_stop
    System.exec('stopping node.js service.','sudo forever stopall', 'node.js service is closed.', 'failed to close node.js service.')
  end
  #</editor-fold>

  #<editor-fold desc="static method : mongo_start">
  def self.mongo_start
    System.exec('starting mongodb service.','sudo service mongod start', 'mongodb service is running.','failed to start mongodb service.')
  end
  #</editor-fold>

  #<editor-fold desc="static method : mongo_stop">
  def self.mongo_stop
    System.exec('stopping mongodb service.','sudo service mongod stop', 'mongodb service is closed.','impossible to close mongodb service.')
  end
  #</editor-fold>

  #<editor-fold desc="static method : server_start">
  def self.server_start
    # start mongodb service
    mongo_start

    # start node.js service
    node_start
  end
  #</editor-fold>

  #<editor-fold desc="static method : server_stop">
  def self.server_stop

    # check for audits instances
    puts '¤ check for secure server closing.'
    active_audits = Mongodb.get_active_audit

    # check if an audots is running
    if active_audits.any?

      # require user approval
      Approval.ask('some audits process are still running, abort them and remove the audit ?')

      # then unsafe close processing
      puts "[ OK ] - unsafe close processing. \n".valid
      active_audits.each do |audit|
        Archive.archive_remove(audit['_id'])
      end

    else
      puts "[ OK ] - server can be closed securely. \n".valid
    end

    # stop mongodb service
    mongo_stop

    # stop node.js service
    node_stop

    #kill possible remaining audits processes
    System.process_killer

  end
  #</editor-fold>

  #<editor-fold desc="static method : server_status">
  def self.server_status

    # get a service status
    services = Services.get_all_status

    # check for node.js status
    puts '¤ check for node.js instance.'
    if services['nodejs']
      puts "-> node.js server is started.\n".valid
    else
      puts "-> node.js server is inactive.\n".error
    end

    # check for mongodb status
    puts '¤ check for mongodb instance.'
    if services['mongodb']
      puts "-> mongodb server is started.\n".valid
    else
      puts "-> mongodb server is inactive.\n".error
    end

    # check for audits instances
    if services['nodejs'] && services['mongodb']
      puts '¤ check for audits instances.'
      if Mongodb.get_active_audit.any?
        puts "-> [!!] some instance are currently running.\n".alert
      else
        puts "-> no instance are currently running.\n".valid
      end
    end

  end
  #</editor-fold>

end
