{
    "targets": [{
        "target_name": "getargv_native",
        "sources": [ "src/getargv.c" ],
        "defines": [ "_PID_MAX=<!@(man -w setaudit_addr | xargs grep -Eoe 'PID_MAX \\([0-9]+\\)' | tr -Cd '0-9')" ],
        "include_dirs": [ "<!@(pkg-config getargv --cflags-only-I | sed s/-I//g)" ],
        "link_settings": {
            "libraries": [ "<!@(pkg-config getargv --libs)" ]
        },
        "xcode_settings": {
            "MACOSX_DEPLOYMENT_TARGET": "10.7"
        }
    }]
}
