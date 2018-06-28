# Random word set
$txt = get-content .\enable1.txt
$words = $txt | ?{$_.length -gt 4 -and $_.length -le 8}
$code = $txt | ? {$_.length -eq 4}

# Random picker function
function randString{
	$count = $args[0]
	$rndWds = @()
	1..$count | %{
		$rndWds += $words[(get-random -maximum $words.length)]
	}
	$str = $rndWds -join " "
	"`""+$str+"`""
}
function randCode{
	"`""+($code[(get-random -maximum $code.length)]).toUpper()+"`""
}
function randSCA{
	"`""+@("Student","Coach","Admin")[(get-random -maximum 2)]+"`""
}
function randDate{
	[datetime]$min = "1/1/2018"
	[datetime]$max = "12/31/2018"
	
	$d = Get-Date ($min.ticks + (get-random -max ($max.Ticks - $min.Ticks))) -format "yyyy-MM-dd HH:mm:ss"
	
	"`"$d`""
}
#`"

$zero = $function:zeroID
$rand = $function:randString
$scaR = $function:randSCA
$dateR = $function:randDate
$randCode = $function:randCode

# functions for non-fk tables
function users{
	[pscustomobject]@{
		userID = 0
		userName = (& $rand 1)
	}
}
function team{
	[pscustomobject]@{
		teamID = 0
		teamName = (& $rand 1)
	}
}
function task{
	[pscustomobject]@{
		taskID = 0
		taskName = (& $rand 1)
		taskDescription = (& $rand 10)
	}
}
function event{
	[pscustomobject]@{
		eventID = 0
		eventName = (& $rand)
		keyEvent = (get-random -max 2)
		startTime = (& $dateR)
		endTime = (& $dateR)
	}
}
function attendanceCode{
	[pscustomobject]@{
		attendanceCodeID=0
		attendanceCode=(& $randCode)
		description= (& $rand 3)
	}
}
function permissionForm{
	[pscustomobject]@{
		permissionFormID=0
		name=(& $rand 1)
		description = (& $rand 10)
	}
}
function account{
	[pscustomobject]@{
		accountID=0
		accountName=(& $rand 1)
		currentBalance=0
	}
}
function requestType{
	[pscustomobject]@{
		requestTypeID=0
		description=(& $rand 1)
	}
}
function requestStatus{
	[pscustomobject]@{
		requestStatusID=0
		description=(& $rand 1)
	}
}
function itemRestriction{
	[pscustomobject]@{
		itemRestrictionID=0
		description=(& $rand 1)
	}
}

#set of non-fk tables
$nonFKset = @("users","team","task","event","attendanceCode","permissionForm","account","requestType","requestStatus","itemRestriction")

# data
$data = $nonFKset | % {
	$c = $_
	$out = [pscustomobject]@{
		table_name = $c
	}
	$rowArr = 1..10 | % {
		$c | iex
	}
	$out | add-member -type noteproperty -name rows -value $rowArr
	$out
}



$sql = $data | % {
	$table = $_.table_name
	$rows = $_.rows
	
	$rows | % {
		$valArr = ($_.psobject.properties | % {$_.value})-join","
		"insert into $table values ($valArr);"
	}
}

function randFK{
	10000 + (get-random -maximum 9)
}
$randFK = $function:randFK

function teamUserAssignment{
	[pscustomobject]@{
		teamUserAssignmentID=0
		teamID=(& $randFK)
		userID=(& $randFK)
	}
}