import { useRef } from "react";

export default function EditorComponent() {
  const imageRefs = useRef(null);

  const handleImage = () => {};

  return (
    <>
      <div className="w-full border border-black rounded-xl">
        <div className="toolbar">
          <div className="profile_">
            <img src="" alt="" />
            <p>Name</p>
          </div>
          <div className="toolbar_image_ref" onClick={handleImage}></div>
          <input
            type="file"
            name="images"
            id="toolbar-image"
            ref={imageRefs}
            style={{ display: "none" }}
          />
        </div>
        <textarea
          name="post"
          id="post"
          placeholder="Enter your post here! ..."
          rows={5}
        ></textarea>
      </div>
    </>
  );
}
