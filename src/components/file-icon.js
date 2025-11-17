import PropTypes from 'prop-types';
import { getAssetPath } from 'src/utils/asset-path';

const icons = {
  jpeg:   getAssetPath('/assets/icons/icon-jpg.svg'),
  jpg: getAssetPath('/assets/icons/icon-jpg.svg'),
  mp4: getAssetPath('/assets/icons/icon-mp4.svg'),
  pdf: getAssetPath('/assets/icons/icon-pdf.svg'),
  png: getAssetPath('/assets/icons/icon-png.svg'),
  svg: getAssetPath('/assets/icons/icon-svg.svg')
};

export const FileIcon = (props) => {
  const { extension } = props;

  let icon;

  if (!extension) {
    icon = getAssetPath('/assets/icons/icon-other.svg');
  } else {
    icon = icons[extension] || getAssetPath('/assets/icons/icon-other.svg');
  }

  return <img src={icon} />;
};

FileIcon.propTypes = {
  extension: PropTypes.string
};
