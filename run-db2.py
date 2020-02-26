#! /usr/bin/python
#
# Simple Python script using subprocess to query a DB2 db.
# Pete
#

from subprocess import Popen, PIPE
from os import chdir
import re, sys, string, os.path, io, subprocess
from datetime import date
from optparse import OptionParser

DEFAULT_DB2OPTS = '-cmstx +p'
parser = OptionParser()

def parse_cli_args():
    parser.add_option("--sql", action="store", type="str", dest="sql", help="Sql file", metavar="FILE")
    parser.add_option("--dbname", action="store", type="str", dest="dbname", help="DB name(default=PDDB)", default='PDDB')
    parser.add_option("--db2opts", action="store", type="str", dest="db2opts", help="DB2 opts(default=" + DEFAULT_DB2OPTS + ")", default=DEFAULT_DB2OPTS)

    return parser.parse_args()

def get_sql_stmt( sql_filename ):

    fin = open(sql_filename, 'r')

    sql_stmt = ''
    for line in fin.readlines():
        sql_stmt += line

    fin.close()

    return sql_stmt

def run_db2(options):
    if options.db2opts:
        os.environ['DB2OPTIONS'] = options.db2opts
    else:
        os.environ['DB2OPTIONS'] = DEFAULT_DB2OPTS

    sess1 = Popen(['db2', ('connect to ' + options.dbname)] )
    session = Popen(['db2', '-z', 'db2-zlog.log', '-l', 'db2-history.log'], stdin=PIPE, stdout=PIPE, stderr=PIPE)
    sql_stmt = get_sql_stmt( options.sql )
    session.stdin.write( sql_stmt )

    return session.communicate()

def main():

    options, args = parse_cli_args()
    sqlfile = options.sql

    if options.sql == None:
        parser.print_help()
        exit(1)

    stdoutStrings, stderrStrings = run_db2( options )

    for line in stdoutStrings.split('\n'):
        print( line.strip() )

    for line in stderrStrings.split('\n'):
        print >>sys.stderr, line.strip()

if __name__ == "__main__":
    main()
