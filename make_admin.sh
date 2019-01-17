export LC_ALL=C
mongo <<EOF
use consumables;
db.faculties.update({username: #replace_it_with_username}, {$set:{isAdmin: true}});
EOF
#This is to remove a Admin --replace the above script line:4
#db.faculties.update({username: "admin"}, {$set:{isAdmin: false}});