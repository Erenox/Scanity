# ./lib/core/requirement_manager.rb
# Manage requirements for processing
# Created by : Erenox the : 02/12/2016
# Last update : 02/12/2016

# private core gems
require_relative '../core/approval_manager'

# private processing gems
require_relative '../processing/server_processing'

class Requirement

  #<editor-fold desc="static method : stop_required">
  def self.server_stop_required

    # get a service status
    services = Services.get_all_status

    if services['nodejs'] || services['mongodb']
      # require user approval
      Approval.ask('server is currently running, stop it for continue ?')

      # then stop the server
      Server.server_stop
    end

  end
  #</editor-fold>

  #<editor-fold desc="static method : database_required">
  def self.database_start_required

    # get a service status
    services = Services.get_all_status

    if !services['mongodb']
      # require user approval
      Approval.ask('mongo service is currently stopped, start it now ?')

      # then start mongo service
      Server.mongo_start
    end

  end
  #</editor-fold>

end


