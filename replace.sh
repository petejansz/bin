#! /bin/sh

SCRIPT=$(basename $0)
OLD_REGEX=
NEW_REGEX=
FILE=

# Defaults:
HELP=false

function help()
{
  echo "Perform, in-place edit of old regex with new regex"                                >&2
  echo "File is backed up to filename.long-time"                                            >&2
  echo "USAGE: $(basename $0) [options] --file <filename> --old 'regex' --new 'regex'"     >&2
  echo "  options"                                                                         >&2
  echo "  -f | --file     <filename>"                                                      >&2
  echo "  -o | --old     'regex'"                                                          >&2
  echo "  -n | --new     'regex'"                                                          >&2
  echo '  -h   --help'                                                                     >&2
}

# options parser:
OPTS=$(getopt -o f:ho:n: --long file:,help,old:,new: -n 'parse-options' -- "$@")
if [ $? != 0 ]; then
  help
  exit 1
fi
eval set -- "$OPTS"

while true; do
  case "$1" in
      -f | --file     ) FILE="$2";      shift; shift ;;
      -o | --old ) OLD_REGEX="$2";  shift; shift ;;
      -n | --new ) NEW_REGEX="$2";  shift; shift ;;
      -h | --help     ) HELP=true;      shift ;;
      -- )                              shift; break ;;
       * )                              break ;;
  esac
done

if [[ "$HELP" == 'true' || -z "$OLD_REGEX"  || -z "$NEW_REGEX" || -z "FILE" ]]; then
  help
  exit 1
fi

export OLD_REGEX
export NEW_REGEX
BACKUP_SUFFIX=$(date +%s)
perl -p -i.${BACKUP_SUFFIX} -e 's/$ENV{OLD_REGEX}/$ENV{NEW_REGEX}/g' $FILE

OLD_REGEX=
NEW_REGEX=
