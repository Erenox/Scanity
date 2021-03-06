# ./lib/core/initiative_manager.rb
# Ask user about some action during processing

# private core gems
require_relative '../core/approval_manager'

# private processing gems
require_relative '../processing/server_processing'


class Initiative

  #<editor-fold desc="static method : server_start_initiative">
  def self.server_start_initiative

    # get a service status
    services = Services.get_all_status

    if !services['nodejs'] && !services['mongodb']

      # require user approval
      Approval.ask('server is currently stopped, start it now ?')

      # then start the server
      Server.server_start

    end

  end
  #</editor-fold>

  #<editor-fold desc="static method : database_stop_initiative">
  def self.database_stop_initiative

    # get a service status
    services = Services.get_all_status

    if services['mongodb'] && !services['nodejs']

      # require user approval
      Approval.ask('mongod service is running but it is not required anymore, stop it ?')

      # then stop mongo service
      Server.mongo_stop

    end

  end
  #</editor-fold>

end
