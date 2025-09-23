FIRST=$1
SECOND=$2

if [ "x$FIRST" == "x" ]
then
    exit
fi
if [ "x$SECOND" == "x" ]
then
    exit
fi
   
for i in $(cat list); do                                                    
    echo $i
    magick  $FIRST/$i  -crop 2830x4141+0+0 crop1.png
    magick  $SECOND/$i -crop 2830x4141+0+0 crop2.png
    compare -metric AE crop1.png crop2.png out-$i
    compare -compose src crop1.png crop2.png compose-$i
    echo
done
