# ./lib/processing.rb
# Execute server manager operations

# private core gems ./core/*
require_relative './core/string_overwrite.rb'
require_relative './core/services_manager.rb'
require_relative './core/system_manager.rb'
require_relative './core/mongo_manager.rb'
require_relative './core/requirement_manager'
require_relative './core/initiative_manager'

# private processing gems ../lib/processing/*
require_relative '../lib/processing/archive_processing.rb'
require_relative '../lib/processing/deploy_processing.rb'
require_relative '../lib/processing/log_processing.rb'
require_relative '../lib/processing/server_processing.rb'
require_relative '../lib/processing/update_processing.rb'
require_relative '../lib/processing/blacklist_processing.rb'


class Processing

  #<editor-fold desc="class constructor : initialize">
  def initialize(operation)
    @operation = operation
    @services = Services.get_all_status
  end
  #</editor-fold>

  #<editor-fold desc="method : run">
  def run
    case @operation

      #<editor-fold desc="--server / -s processing section">
      when 'server_start'
        if !@services['nodejs'] || !@services['mongodb']
            Server.server_start
        else
            puts '[ ERROR ] - server is already running.'.error
        end

      when 'server_stop'
        if @services['nodejs'] || @services['mongodb']
          Server.server_stop
        else
          puts '[ ERROR ] - server is already stopped.'.error
        end

      when 'server_restart'
        if @services['nodejs'] || @services['mongodb']
          Server.server_stop
        end
        Server.server_start

      when 'server_status'
        Server.server_status
      #</editor-fold>

      #<editor-fold desc="--deploy / -d processing section">
      when 'deploy_install'
        Requirement.server_stop_required
        Deploy.install
        Initiative.database_stop_initiative
      #</editor-fold>

      #<editor-fold desc="--update / -u processing section">
      when 'update_server'
        Requirement.server_stop_required
        Update.update_server
        Initiative.server_start_initiative

      when 'update_system_core'
        Requirement.server_stop_required
        Update.update_system_core
        Initiative.server_start_initiative

      when 'update_system_packages'
        Requirement.server_stop_required
        Update.update_system_packages
        Initiative.server_start_initiative
      #</editor-fold>

      #<editor-fold desc="--archive / -a processing section">
      when 'archive_display'
        Requirement.database_start_required
        Archive.archive_display
        Initiative.database_stop_initiative

      when 'archive_remove'
        Requirement.database_start_required
        Archive.archive_remove
        Initiative.database_stop_initiative

      when 'archive_remove_all'
        Requirement.database_start_required
        Archive.archive_remove_all
        Initiative.database_stop_initiative

      when 'archive_export'
        Requirement.database_start_required
        Archive.archive_export
        Initiative.database_stop_initiative

      when 'archive_import'
        Requirement.database_start_required
        Archive.archive_import(nil)
        Initiative.database_stop_initiative
      #</editor-fold>

      #<editor-fold desc="--blacklist / -b processing section">
      when 'blacklist_display'
        Blacklist.blacklist_display

      when 'blacklist_add'
        Blacklist.blacklist_add

      when 'blacklist_remove'
        Blacklist.blacklist_remove
      #</editor-fold>

      #<editor-fold desc="--log / -l processing section">
      when 'log_client'
        Log.log_client

      when 'log_server'
        Log.log_server

      when 'log_clear_client'
        Log.log_clear_client

      when 'log_clear_server'
        Log.log_clear_server
      #</editor-fold>

      else
        puts "[ ERROR ] - unknown action : #{@operation}".error
    end

  end
  #</editor-fold>

end
