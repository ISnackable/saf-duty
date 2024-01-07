import {
  IconCalendar,
  IconCamera,
  IconCheck,
  IconDeviceDesktop,
  IconEdit,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconMenu2,
  IconMoon,
  IconSun,
  IconX,
} from '@tabler/icons-react';

type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (props: IconProps) => (
    <svg
      version='1.0'
      xmlns='http://www.w3.org/2000/svg'
      role='img'
      aria-label='main logo'
      width='1024.000000pt'
      height='1024.000000pt'
      viewBox='0 0 1024.000000 1024.000000'
      preserveAspectRatio='xMidYMid meet'
      {...props}
    >
      <g
        transform='translate(0.000000,1024.000000) scale(0.100000,-0.100000)'
        fill='currentColor'
        stroke='none'
      >
        <path
          d='M3255 8037 c-62 -21 -104 -45 -152 -90 -55 -50 -90 -118 -109 -207
    -7 -37 -16 -75 -20 -83 -3 -8 -38 -26 -77 -41 -98 -36 -189 -99 -277 -193 -88
    -92 -138 -182 -175 -308 l-25 -90 3 -2135 c3 -2384 -4 -2182 73 -2335 77 -156
    193 -275 346 -352 162 -83 -23 -77 2218 -80 1447 -3 2017 -1 2075 7 129 19
    225 54 324 121 131 87 212 190 282 357 61 148 60 115 63 1597 1 743 -1 1694
    -4 2115 l-6 765 -23 70 c-67 201 -242 386 -432 455 -35 13 -72 30 -81 39 -9 9
    -24 49 -32 90 -19 93 -46 148 -102 209 -60 68 -125 95 -229 96 -91 1 -162 -25
    -228 -83 -38 -34 -94 -121 -117 -181 -19 -51 -28 -56 -41 -24 -83 205 -177
    284 -339 287 -122 2 -248 -80 -304 -199 -15 -31 -29 -76 -33 -100 -10 -79 20
    -74 -438 -75 -225 -1 -541 -1 -701 0 l-290 1 -13 64 c-17 88 -51 157 -106 215
    -63 67 -127 94 -230 95 -69 1 -88 -3 -138 -27 -67 -33 -140 -115 -188 -208
    -16 -33 -33 -58 -37 -55 -4 2 -25 39 -47 81 -52 99 -123 168 -196 189 -78 23
    -148 28 -194 13z m161 -219 c19 -13 43 -41 54 -64 19 -38 20 -61 20 -387 0
    -380 -1 -391 -58 -439 -73 -61 -185 -36 -229 52 -23 43 -23 51 -23 390 0 339
    0 347 23 390 42 85 136 110 213 58z m674 22 c28 0 81 -49 101 -95 17 -36 19
    -71 19 -370 0 -181 -5 -348 -10 -370 -12 -53 -64 -101 -119 -110 -52 -9 -120
    22 -153 68 -23 32 -23 37 -26 382 -2 193 -1 364 3 380 3 17 17 46 33 63 27 33
    96 65 120 57 8 -3 22 -5 32 -5z m2122 0 c45 -13 94 -67 108 -120 7 -27 10
    -156 8 -378 -3 -318 -4 -339 -23 -372 -28 -47 -77 -74 -137 -74 -54 0 -89 21
    -125 74 -23 33 -23 36 -23 400 0 364 0 367 23 401 20 31 95 79 122 79 5 0 27
    -5 47 -10z m758 -19 c42 -30 68 -79 76 -139 4 -31 4 -198 1 -370 -6 -278 -9
    -318 -25 -345 -25 -44 -76 -71 -134 -71 -54 0 -89 21 -126 74 l-23 34 3 377 3
    378 30 32 c17 17 44 38 60 45 37 17 101 10 135 -15z m-1148 -573 l3 -293 28
    -57 c114 -232 401 -276 571 -88 49 55 86 135 93 205 3 31 7 54 9 52 2 -2 9
    -30 15 -62 22 -122 99 -224 207 -277 56 -28 77 -33 137 -33 130 1 221 48 287
    149 58 90 68 136 68 318 0 87 3 158 8 158 4 0 30 -13 58 -30 65 -37 125 -105
    165 -186 41 -82 48 -171 49 -597 l0 -328 -25 -24 -24 -25 -2360 0 -2360 0 -21
    27 c-21 27 -21 31 -18 453 l3 426 35 68 c19 38 55 89 80 114 42 42 125 102
    141 102 4 0 9 -80 11 -177 3 -170 4 -181 31 -238 95 -203 334 -274 515 -152
    71 48 152 188 152 264 0 56 17 56 23 0 12 -115 106 -244 215 -295 46 -22 72
    -26 137 -27 71 0 88 4 148 33 74 37 126 95 169 187 22 48 23 63 26 338 l3 287
    709 0 709 0 3 -292z m1677 -1441 c16 -20 18 -2944 2 -3010 -37 -154 -161 -294
    -309 -350 l-57 -22 -1975 -3 c-1361 -2 -1997 1 -2044 8 -196 30 -358 192 -395
    395 -8 40 -11 514 -11 1505 0 1292 2 1448 16 1468 l15 22 2373 0 c1955 0 2375
    -2 2385 -13z'
        />
        <path
          d='M5000 7286 c-153 -43 -277 -160 -331 -312 -17 -48 -20 -77 -17 -160
    3 -90 7 -107 37 -168 72 -146 226 -254 376 -264 153 -10 267 32 364 132 87 91
    135 193 140 300 4 100 -18 186 -69 264 -44 68 -121 142 -178 171 -95 48 -227
    63 -322 37z m223 -169 l39 -17 -22 -27 c-12 -16 -56 -63 -97 -106 l-75 -77
    -34 30 c-19 16 -46 30 -59 30 -27 0 -55 -33 -55 -66 0 -25 111 -150 141 -159
    17 -6 45 18 157 135 l135 142 18 -23 c43 -58 51 -198 14 -269 -32 -61 -103
    -128 -161 -150 -114 -42 -230 -20 -318 61 -161 147 -121 394 79 491 52 25 69
    29 130 25 39 -2 87 -11 108 -20z'
        />
        <path
          d='M3773 6553 l-83 -4 0 -28 c0 -31 14 -41 60 -41 l29 0 3 -107 3 -108
    30 0 30 0 3 106 3 107 37 7 c41 8 52 18 45 45 -5 18 -35 31 -63 28 -8 -1 -52
    -4 -97 -5z'
        />
        <path
          d='M4151 6513 l-33 -47 -37 43 c-28 32 -43 42 -61 39 -13 -1 -25 -8 -27
    -14 -2 -5 16 -39 39 -75 35 -54 42 -74 46 -127 4 -50 8 -65 25 -74 17 -9 24
    -7 40 13 15 18 18 33 13 65 -5 42 -2 49 75 172 13 21 12 25 -5 38 -30 22 -40
    18 -75 -33z'
        />
        <path
          d='M3067 6543 c-9 -8 -9 -246 -1 -267 5 -13 21 -16 76 -16 118 0 168 42
    168 142 0 73 -20 115 -65 134 -35 14 -166 20 -178 7z m151 -83 c31 -29 31 -93
    0 -114 -12 -9 -37 -16 -55 -16 l-33 0 0 75 0 75 33 0 c20 0 42 -8 55 -20z'
        />
        <path
          d='M3394 6536 c-3 -8 -4 -60 -2 -115 3 -95 5 -101 32 -130 26 -27 37
    -31 82 -31 96 0 128 51 122 200 l-3 85 -30 0 -30 0 -5 -98 c-5 -103 -12 -117
    -57 -117 -32 0 -37 15 -43 120 -5 95 -5 95 -33 98 -17 2 -29 -2 -33 -12z'
        />
        <path
          d='M3602 5549 c-121 -20 -226 -102 -280 -217 -24 -50 -27 -69 -27 -157
    0 -93 2 -105 33 -167 52 -106 145 -173 276 -200 152 -30 325 61 398 210 30 61
    33 75 33 157 0 80 -4 97 -31 155 -17 36 -43 80 -59 98 -78 93 -216 141 -343
    121z'
        />
        <path
          d='M5055 5549 c-244 -35 -390 -308 -285 -532 36 -76 93 -133 177 -174
    69 -34 84 -38 157 -38 155 0 269 70 340 209 39 74 41 83 41 165 -1 75 -4 94
    -32 152 -39 85 -88 138 -160 177 -51 27 -76 34 -158 46 -11 2 -47 -1 -80 -5z'
        />
        <path
          d='M6500 5549 c-131 -21 -242 -111 -291 -236 -33 -86 -32 -208 3 -284
    135 -294 532 -301 679 -13 32 63 34 75 34 164 0 82 -4 103 -27 152 -29 62 -93
    137 -142 167 -72 44 -171 63 -256 50z'
        />
        <path
          d='M5320 4733 c-68 -48 -100 -56 -205 -57 -106 -1 -138 7 -209 53 l-38
    25 -75 -38 c-126 -65 -217 -177 -258 -318 -17 -60 -14 -90 13 -120 14 -17 54
    -18 564 -18 546 0 548 0 569 21 19 19 21 29 16 76 -14 135 -129 290 -272 365
    l-70 36 -35 -25z'
        />
        <path
          d='M3350 4717 c-131 -64 -251 -224 -267 -355 -5 -46 -3 -56 17 -77 l23
    -25 544 0 c539 0 543 0 564 21 31 31 22 106 -24 203 -46 97 -133 187 -229 236
    -67 35 -68 35 -95 17 -80 -52 -115 -62 -218 -62 -95 0 -104 2 -170 35 -39 19
    -72 36 -75 37 -3 1 -34 -12 -70 -30z'
        />
        <path
          d='M6230 4713 c-126 -65 -242 -222 -257 -351 -5 -46 -3 -56 17 -77 l23
    -25 542 0 c613 0 585 -3 585 74 0 138 -116 303 -270 385 l-63 34 -73 -38 c-60
    -31 -87 -39 -148 -43 -90 -6 -159 10 -221 49 -25 16 -50 29 -54 29 -5 0 -41
    -17 -81 -37z'
        />
        <path
          d='M5051 4008 c-74 -11 -131 -39 -186 -89 -85 -78 -126 -173 -126 -289
    -1 -104 27 -175 95 -244 192 -197 494 -150 615 95 65 133 47 277 -51 401 -73
    94 -218 146 -347 126z'
        />
        <path
          d='M6498 4009 c-240 -34 -383 -303 -282 -529 30 -66 98 -137 167 -174
    189 -99 415 -19 514 182 25 50 28 68 28 152 0 82 -4 103 -27 152 -35 75 -104
    148 -170 180 -47 23 -73 30 -153 42 -11 2 -45 -1 -77 -5z'
        />
        <path
          d='M3540 3994 c-96 -35 -175 -108 -218 -203 -22 -48 -26 -71 -26 -156
    -1 -90 2 -106 27 -157 73 -149 240 -237 395 -210 130 23 221 91 279 210 35 70
    38 83 38 162 0 74 -4 93 -32 152 -40 85 -100 150 -171 185 -47 23 -72 28 -152
    30 -69 2 -107 -1 -140 -13z'
        />
        <path
          d='M3865 3189 c-116 -81 -306 -75 -427 13 -41 30 -215 -92 -282 -196
    -74 -115 -95 -224 -52 -265 l23 -22 548 3 c533 3 547 3 562 23 39 52 -24 226
    -118 329 -46 51 -122 103 -189 132 -21 9 -31 6 -65 -17z'
        />
        <path
          d='M4789 3178 c-99 -55 -168 -128 -220 -232 -52 -105 -58 -176 -18 -208
    23 -20 38 -20 573 -16 531 4 549 4 563 23 23 31 10 113 -32 201 -47 97 -134
    186 -230 236 -64 33 -72 35 -90 21 -11 -8 -42 -27 -70 -41 -45 -24 -61 -27
    -155 -27 -109 0 -142 10 -221 66 -25 18 -26 17 -100 -23z'
        />
        <path
          d='M6751 3184 c-65 -40 -144 -58 -231 -52 -61 5 -101 19 -177 64 l-33
    19 -75 -38 c-130 -67 -246 -225 -262 -356 -5 -44 -3 -52 21 -76 l27 -27 536 4
    c336 2 544 7 557 13 44 22 37 108 -19 222 -45 92 -130 178 -222 225 l-68 35
    -54 -33z'
        />
      </g>
    </svg>
  ),
  menu: IconMenu2,
  close: IconX,
  spinner: IconLoader2,
  sun: IconSun,
  moon: IconMoon,
  monitor: IconDeviceDesktop,
  check: IconCheck,
  eye: IconEye,
  eyeOff: IconEyeOff,
  edit: IconEdit,
  camera: IconCamera,
  calendar: IconCalendar,
};
