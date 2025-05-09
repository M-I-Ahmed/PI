
## Process Intelligence Module ##

# PLAN #

- Some form of data storage is going to be needed in this service
- An MQTT subscriber is also required to retreive the data being sent between services

# MQTT Topic #
- Robot 
- X position
- Y position 
- Hole Depth
- Recipe Number
- Tool ID
- Feed Rate
- Spindle Speed

# DB Required #
- DB of tools 
- Holes drilled in last hour - Hole ID with timestamps - maybe a metric up 4% since last hour
- Hole Success Rate - Hole ID with pass or fail metric
- No of holes drilled

- Need multiple instances connected to this DB - very simple version
- Two tables one based on Tool ID
- Hole table can have Hole ID, Tool ID, Recipe, Feeds and speeds. not retrieving this from the database but from the MQTT instead. 


# Data Required - Data that needs to be retrieved from one of the other services
- Current Robotic Asset
- Cell ID
- Recipe ID
- Tool ID
- Process
- Hole position
- Spindle Speed
- Feed Rate
- Cycle time - This can be calculated from the time between the message with the parameters being sent to the drill complete message
- Message Log - Create a new MQTT topic, each service publishes an update and this module will subscribe to these and present them
- Cycles to Tool Change - need to know how many holes this tool has drilled - dependent on tool id. Cycles to tool change should be a   value in the DB. AWKWARD - Leave for now


# Fixed Values
- In process part and Part Id
- User name, ID and other details
- End Effector

# Main UI components
HEADER:
- Process Intelligence Title

- User Icon with popover

ASSET TAB:
- Drilling Cell -> Cell ID
- Asset Pictures - dependent on asset selection - drill end effector will be fixed

PART TAB:
- Picture and Part ID will be fixed

CURRENT PROCESS:
- All the parameters of the current process published from the UI

TOOL CHANGE:
- query tool table in the DB to determine this value

CELL STATUS TAB:
- Status:
    - Ready
    - Drilling In Progress
    - Fault

MESSAGE LOG:
- Log of the cells events .

