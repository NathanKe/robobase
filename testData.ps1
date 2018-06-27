# Random word set
$txt = get-content .\enable1.txt
$words = $txt | ?{$_.length -gt 4 -and $_.length -le 8}
$code = $txt | ? {$_.length -eq 4}

# Random picker function
function randString{
	"`""+$words[(get-random -maximum $words.length)]+"`""
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
	
	[datetime]($min.ticks + (get-random -max ($max.Ticks - $min.Ticks)))
}

$zero = $function:zeroID
$rand = $function:randString
$scaR = $function:randSCA
$dateR = $function:randDate
$randCode = $function:randCode

# functions for non-fk tables
function user{
	[pscustomobject]@{
		userID = 0
		userName = (& $rand)
	}
}
function team{
	[pscustomobject]@{
		teamID = 0
		teamName = (& $rand)
	}
}
function task{
	[pscustomobject]@{
		taskID = 0
		taskName = (& $rand)
		taskDescription = (0..10|%{& $rand})-join " "
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
		attendanceCode=(& $randCode)
		description= (0..2|%{& $rand})-join " "
	}
}
function permissionForm{
	[pscustomobject]@{
		permissionFormID=0
		name=(& $rand)
		description = (0..10|%{& $rand})-join " "
	}
}
function account{
	[pscustomobject]@{
		accountID=0
		accountName=(& $rand)
		currentBalance=0
	}
}
function requestType{
	[pscustomobject]@{
		requestTypeID=0
		description=(& $rand)
	}
}
function requestStatus{
	[pscustomobject]@{
		requestStatusID=0
		description=(& $rand)
	}
}
function itemRestriction{
	[pscustomobject]@{
		itemRestrictionID=0
		description=(& $rand)
	}
}

#set of non-fk tables
$nonFKset = @("user","team","task","event","attendanceCode","permissionForm","account","requestType","requestStatus","itemRestriction")

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

$data | % {
	
}