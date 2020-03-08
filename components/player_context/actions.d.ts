export declare const CHANGE_STATE_OF_PLAY: "CHANGE_STATE_OF_PLAY";
export declare const CHANGE_VOLUME: "CHANGE_VOLUME";
export declare const CHANGE_MULTIPLY: "CHANGE_MULTIPLY";
export declare const CHANGE_UNION_BLOCKS: "CHANGE_UNION_BLOCKS";
export declare const changeStateOfPlay: (state_of_play: 1 | 2 | 3) => {
    type: "CHANGE_STATE_OF_PLAY";
    payload: {
        state_of_play: 1 | 2 | 3;
    };
};
export declare const changeVolume: (volume: number) => {
    type: "CHANGE_VOLUME";
    payload: {
        volume: number;
    };
};
export declare const changeMultiply: (multiply: number) => {
    type: "CHANGE_MULTIPLY";
    payload: {
        multiply: number;
    };
};
export declare const changeUnionBlocks: (unionBlocks: number) => {
    type: "CHANGE_UNION_BLOCKS";
    payload: {
        unionBlocks: number;
    };
};
