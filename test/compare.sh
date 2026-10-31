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

#magick crop1.png crop2.png \
#  \( -clone 0,1 -compose difference -composite -colorspace gray \) \
#  \( -clone 0 -fill red -colorize 100% \) \
#  -delete 1 -compose multiply -composite composit-$i

#magick crop1.png crop2.png \
#\( -clone 0,1 -compose difference -composite -colorspace gray \) \
#\( -clone 0 -fill red -colorize 100% \) \
#-delete 1 -swap 0,1 -composite composit-$i


    compare -metric AE crop1.png crop2.png out-$i
    compare -compose src crop1.png crop2.png compose-$i
    echo
done
