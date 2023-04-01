const WIDTH = 90;
const HEIGHT = 90;
const JUMP = 1;


console.log('. . . v e n t . . .');

const [canvas] = document.getElementsByTagName('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d', { willReadFrequently: true });

const drawPixel = (x, y, r, g, b, a, canvasData) => {
    const x0 = Math.floor(((x + 0) / WIDTH)  * canvas.width);
    const x1 = Math.ceil(((x + 1) / WIDTH)  * canvas.width);
    const y0 = Math.floor(((y + 0) / HEIGHT) * canvas.height);
    const y1 = Math.ceil(((y + 1) / HEIGHT) * canvas.height);

    for (let y = y0; y <= y1; y += JUMP) {
        for (let x = x0; x <= x1; x += JUMP) {
            const index = (x + y * canvas.width) * 4;

            canvasData.data[index + 0] = r;
            canvasData.data[index + 1] = g;
            canvasData.data[index + 2] = b;
            canvasData.data[index + 3] = a;
        }
    }
}

const dot = (a, b) => (a.x*b.x) + (a.y*b.y) + (a.z*b.z);
const mul = (a, b) => ({
    x: a.x*b,
    y: a.y*b,
    z: a.z*b
});
const add = (a, b) => ({
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z
});
const sub = (a, b) => add(a, mul(b, -1));
const pow2 = (a) => dot(a,a);
const len = (a) => Math.sqrt(pow2(a));
const norm = (a) => {
    const d = Math.sqrt(pow2(a));
    return {
        x: a.x / d,
        y: a.y / d,
        z: a.z / d,
    }
};
const cross = (a, b) => ({
    x: (a.y * b.z) - (a.z*b.y),
    y: (a.z * b.x) - (a.x*b.z),
    z: (a.x * b.y) - (a.y*b.x),
})
const rotX = (a, d) => ({
    x: a.x,
    y: (a.y * Math.cos(d)) - (a.z * Math.sin(d)),
    z: (a.y * Math.sin(d)) + (a.z * Math.cos(d))
});
const rotY = (a, d) => ({
    x: (a.x * Math.cos(d)) + (a.z * Math.sin(d)),
    y: a.y,
    z: -(a.x * Math.sin(d)) + (a.z * Math.cos(d))
});
const rotZ = (a, d) => ({
    x: (a.x * Math.cos(d)) - (a.y * Math.sin(d)),
    y: (a.x * Math.sin(d)) + (a.y * Math.cos(d)),
    z: a.z
});

const ddFOV = 0.007;
let FOV = 1;
let dFOV = -ddFOV;
const createLineFromCamera = (x,y) => ({
    o: {
        x: ((2 * (x/WIDTH)) - 1),
        y: ((2 * (y/HEIGHT)) - 1),
        z: 1,
    },
    u: norm({
        x: FOV * ((2 * (x/WIDTH)) - 1),
        y: FOV * ((2 * (y/HEIGHT)) - 1),
        z: -1,
    })
});

const X_COLOR = { r: 167, g: 199, b: 231 };
const Y_COLOR = { r: 193, g: 225, b: 193 };
const Z_COLOR = { r: 255, g: 250, b: 160 };

const cube = (o, s, top, right, bottom, left, front, back) => [
    ...(!back ? [] : 
        [{
            v1: { x: o.x + 0, y: o.y + 0, z: o.z + 0, },
            v2: { x: o.x + 0, y: o.y + s, z: o.z + 0, },
            v3: { x: o.x + s, y: o.y + s, z: o.z + 0, },
            c: Z_COLOR
        },
        {
            v1: { x: o.x + 0, y: o.y + 0, z: o.z + 0, },
            v2: { x: o.x + s, y: o.y + s, z: o.z + 0, },
            v3: { x: o.x + s, y: o.y + 0, z: o.z + 0, },
            c: Z_COLOR
        },
    ]),
    ...(!bottom ? [] :
        [{
            v1: { x: o.x + 0, y: o.y + s, z: o.z + 0, },
            v2: { x: o.x + 0, y: o.y + s, z: o.z + s, },
            v3: { x: o.x + s, y: o.y + s, z: o.z + s, },
            c: Y_COLOR
        },
        {
            v1: { x: o.x + 0, y: o.y + s, z: o.z + 0, },
            v2: { x: o.x + s, y: o.y + s, z: o.z + s, },
            v3: { x: o.x + s, y: o.y + s, z: o.z + 0, },
            c: Y_COLOR
        },
    ]),
    ...(!right ? [] : [
        {
            v1: { x: o.x + s, y: o.y + s, z: o.z + s, },
            v2: { x: o.x + s, y: o.y + 0, z: o.z + s, },
            v3: { x: o.x + s, y: o.y + 0, z: o.z + 0, },
            c: X_COLOR
        },
        {
            v1: { x: o.x + s, y: o.y + s, z: o.z + s, },
            v2: { x: o.x + s, y: o.y + 0, z: o.z + 0, },
            v3: { x: o.x + s, y: o.y + s, z: o.z + 0, },
            c: X_COLOR
        },
    ]),
    ...(!left ? [] : [
        {
            v1: { x: o.x + 0, y: o.y + 0, z: o.z + 0, },
            v2: { x: o.x + 0, y: o.y + s, z: o.z + 0, },
            v3: { x: o.x + 0, y: o.y + s, z: o.z + s, },
            c: X_COLOR
        },
        {
            v1: { x: o.x + 0, y: o.y + 0, z: o.z + 0, },
            v2: { x: o.x + 0, y: o.y + s, z: o.z + s, },
            v3: { x: o.x + 0, y: o.y + 0, z: o.z + s, },
            c: X_COLOR
        },
    ]),
    ...(!top ? [] :
        [{
            v1: { x: o.x + 0, y: o.y + 0, z: o.z + 0, },
            v2: { x: o.x + 0, y: o.y + 0, z: o.z + s, },
            v3: { x: o.x + s, y: o.y + 0, z: o.z + s, },
            c: Y_COLOR
        },
        {
            v1: { x: o.x + 0, y: o.y + 0, z: o.z + 0, },
            v2: { x: o.x + s, y: o.y + 0, z: o.z + s, },
            v3: { x: o.x + s, y: o.y + 0, z: o.z + 0, },
            c: Y_COLOR
        },
    ]),
    ...(!front ? [] : [
        {
            v1: { x: o.x + 0, y: o.y + 0, z: o.z + s, },
            v2: { x: o.x + 0, y: o.y + s, z: o.z + s, },
            v3: { x: o.x + s, y: o.y + s, z: o.z + s, },
            c: Z_COLOR
        },
        {
            v1: { x: o.x + 0, y: o.y + 0, z: o.z + s, },
            v2: { x: o.x + s, y: o.y + s, z: o.z + s, },
            v3: { x: o.x + s, y: o.y + 0, z: o.z + s, },
            c: Z_COLOR
        },
    ])
];

const triangles = [];

let isPreviusCustom = false;
const addCubes = (s, zStart, chunksize) => {

    for (let z = zStart, i = 0; zStart-(chunksize*s) < z; z -= s, i++) {

        if (0.7 < Math.random() || isPreviusCustom) {
            triangles.push(
                ...cube({x: -1, y: -1, z}, s, true, true, true, true, false, false),
            )
            isPreviusCustom = false;
        } else {
            isPreviusCustom = true;

            const choice = Math.floor(Math.random() * 5);

            if (choice === 0) {
                triangles.push(
                    ...cube({x: -1, y: -1, z}, s, true, false, true, true, false, false),
                    ...cube({x:  1, y: -1, z}, s, true, true, true, false, false, true),
                )
            }

            if (choice === 1) {
                triangles.push(
                    ...cube({x: -3, y: -1, z}, s, true, false, true, true, false, true),
                    ...cube({x: -1, y: -1, z}, s, true, false, true, false, false, false),
                    ...cube({x:  1, y: -1, z}, s, true, true, true, false, false, true),
                )
            }

            if (choice === 2) {
                triangles.push(
                    ...cube({x: -1, y: -3, z}, s, true, true, false, true, false, true),
                    ...cube({x: -3, y: -1, z}, s, true, false, true, true, false, true),
                    ...cube({x: -1, y: -1, z}, s, false, false, true, false, false, false),
                    ...cube({x:  1, y: -1, z}, s, true, true, true, false, false, true),
                )
            }

            if (choice === 3) {
                triangles.push(
                    ...cube({x: -1, y: -3, z}, s, true, true, false, true, false, true),
                    ...cube({x: -3, y: -1, z}, s, true, false, true, true, false, true),
                    ...cube({x: -1, y: -1, z}, s, false, false, false, false, false, false),
                    ...cube({x:  1, y: -1, z}, s, true, true, true, false, false, true),
                    ...cube({x: -1, y:  1, z}, s, false, true, true, true, false, true),
                )
            }

            if (4 <= choice) {
                triangles.push(
                    ...cube({x: -3, y: -3, z}, s, true, false, false, true, false, true),
                    ...cube({x: -1, y: -3, z}, s, true, true, false, false, false, true),
                    ...cube({x: -3, y: -1, z}, s, false, false, true, true, false, true),
                    ...cube({x: -1, y: -1, z}, s, false, false, false, false, false, false),
                    ...cube({x:  1, y: -1, z}, s, true, true, true, false, false, true),
                    ...cube({x: -1, y:  1, z}, s, false, true, true, true, false, true),
                )
            }
        }

        // // top-left
        // triangles.push(
        //     ...cube({x: -3, y: -3, z}, s, true, false, false, true, false, false),
        // )

        // // top-center
        // triangles.push(
        //     ...cube({x: -1, y: -3, z}, s, false, false, true, false, true, false),
        // )

        // // top-right
        // triangles.push(
        //     ...cube({x:  1, y: -3, z}, s, true, true, false, false, false, false),
        // )

        // // center-left
        // triangles.push(
        //     ...cube({x: -3, y: -1, z}, s, false, false, false, true, false, false),
        // )

        // // center-center
        // triangles.push(
        //     ...cube({x: -1, y: -1, z}, s, false, false, false, false, false, false),
        // )

        // // center-right
        // triangles.push(
        //     ...cube({x:  1, y: -1, z}, s, false, true, false, false, false, false),
        // )

        // // bottom-left
        // triangles.push(
        //     ...cube({x: -3, y:  1, z}, s, false, false, true, true, false, false),
        // )

        // // bottom-center
        // triangles.push(
        //     ...cube({x: -1, y:  1, z}, s, true, false, false, false, true, false),
        // )

        // // bottom-right
        // triangles.push(
        //     ...cube({x:  1, y:  1, z}, s, false, true, true, false, false, false),
        // )

    }

}

const hypotenuse = (t) => {
    const [[h1,h2]] = [
        [t.v1, t.v2], [t.v1, t.v3], [t.v2, t.v3],
    ].map(
        e => ([...e, len(sub(e[0], e[1]))])
    ).sort(
        (a,b) => -a[2]+b[2]
    );

    return {h1,h2}
}

const lineVsTriangle = (l, t, fov) => {
    const EPS = 0.00001;

    const edge1 = sub(t.v2, t.v1);
    const edge2 = sub(t.v3, t.v1);
    const h = cross(l.u, edge2);
    const a = dot(edge1, h);

    if (-EPS < a && a < EPS) {
        return undefined;
    }

    const f = 1.0/a;
    const s = sub(l.o, t.v1);
    const u = f * dot(s, h);

    if (u < 0 || 1 < u) {
        return undefined;
    }

    const q = cross(s, edge1);
    const v = f * dot(l.u, q);

    if (v < 0 || 1 < (u+v)) {
        return undefined;
    }

    const d = f * dot(edge2, q);

    if (d <= -fov) {
        return undefined;
    }

    const point = add(l.o, mul(l.u, d));

    const shadeN = Math.abs(dot(norm(cross(edge1, edge2)), l.u));

    const {h1, h2} = hypotenuse(t);

    const midpoint = add(h1, mul(sub(h2, h1), 0.5))

    const distM = 2.5/(10 * len(sub(point, midpoint)) / len(sub(h1, h2)));

    const dist = pow2(sub(point, l.o));

    return { point, shade: (distM + shadeN)/2, dist };
}

const fpsHolder = document.getElementById('fps');
const widthHolder = document.getElementById('width');
widthHolder.textContent = `WIDTH: ${WIDTH}`;
const heightHolder = document.getElementById('height');
heightHolder.textContent = `HEIGHT: ${HEIGHT}`;

let aX = 0;
let aY = 0;
let aZ = 0;

let dZ = 0;
let speed = 10;

let last = new Date();


const s = 2;
const chunksize = 1;
let cubeCounter = 0;
let chunkCounter = 0;

let end = [];

const draw = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    end = cube(
        {x: -3, y: -3, z: ((dZ/speed))-(3*chunksize)-10}, s*3,
        false, false, false, false, true, false
    )

    for (let y = 0; y < HEIGHT; y += 1) {
        for (let x = 0; x < WIDTH; x += 1) {

            const l = createLineFromCamera(x,y);

            l.o = rotZ(l.o, aZ);
            l.u = rotZ(l.u, aZ);
            l.o = add(l.o, mul({x: 0, y: 0, z: dZ}, 1/speed));

            let dist = undefined;

            for (const t of [...triangles, ...end]) {
                const res = lineVsTriangle(l, t, FOV);

                if (!res) {
                    continue;
                }

                if (dist !== undefined && dist < res.dist) {
                    continue;
                }

                dist = res.dist;

                const r = res.shade;

                const fadein = -dZ < 150 ? 0 : (-dZ < 250 ? (-dZ-150)/100: 1);

                drawPixel(x, y, t.c.r, t.c.g, t.c.b, fadein*(Math.abs(Math.sin(-dZ/100))*(r*255)), canvasData);
            }
        }
    }

    ctx.putImageData(canvasData, 0, 0);

    const now = new Date();
    const delta = (now.valueOf() - last.valueOf()) / 1000;
    const fps = 1/delta;
    last = now;

    fpsHolder.textContent = `FPS: ${fps.toFixed()}`;

    for (const [i, t] of triangles.entries()) {
        if ((
            (dZ/speed) + 1 < t.v1.z &&
            (dZ/speed) + 1 < t.v2.z &&
            (dZ/speed) + 1 < t.v3.z
        )) {
            triangles.splice(i, 1);
        }
    }

    aZ = ((aZ+0.01) % 360);
    dZ = dZ - 1;

    if (((dZ % (((s)*speed)))) == 0) {
        cubeCounter++;
        cubeCounter %= chunksize;

        if (cubeCounter === 0) {
            addCubes(s, ((dZ/speed))-(2*chunksize)-10, chunksize);
            chunkCounter++;
        }
    }

    requestAnimationFrame(draw);
}

draw();