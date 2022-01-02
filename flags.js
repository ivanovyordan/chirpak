import args from "args"

args
    .option(
        "pmr",
        "Include PRM",
        false,
    )
    .option(
        "no-national",
        "Do not include national repeaters",
        false,
    )
    .option(
        "no-local",
        "Do not include local repeaters",
        false,
    )
    .option(
        "no-simplex",
        "Do not include simplex/direct frequencies",
        false,
    )
    .option(
        "no-special",
        "Do not include special frequencies",
        false,
    )
    .option(
        "coordinates",
        "Station coordinates (<lon,lat>)",
        "25.1370926,42.1379215",
        coordinates => coordinates.split(","),
    )

export default args.parse(process.argv)
