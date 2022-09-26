import args from "args"

args
    .option(
        ["p", "no-prm"],
        "Do not include PRM frequencies",
        false,
    )
    .option(
        ["n", "no-national"],
        "Do not include national repeaters",
        false,
    )
    .option(
        ["l", "no-local"],
        "Do not include local repeaters",
        false,
    )
    .option(
        ["d", "no-simplex"],
        "Do not include simplex frequencies",
        false,
    )
    .option(
        ["s", "no-special"],
        "Do not include special frequencies",
        false,
    )
    .option(
        ["c", "coordinates"],
        "Station coordinates (<lon,lat>)",
        "25.1370926,42.1379215",
        coordinates => coordinates.split(","),
    )

export default args.parse(process.argv)
